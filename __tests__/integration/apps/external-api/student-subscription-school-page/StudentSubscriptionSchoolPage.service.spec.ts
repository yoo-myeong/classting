import { DataSource, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomError } from '@app/common-config/error/CustomError';
import { ResponseStatus } from '@app/common-config/res/ResponseStastus';
import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';
import { StudentSubscriptionSchoolPageEntity } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.entity';
import { getTestMySQLTypeOrmModule } from '../../../../getTestMySQLTypeOrmModule';
import { StudentSubscriptionEntityModule } from '@app/entity/student-subscription-school-page/StudentSubscriptionEntity.module';
import { SchoolPageEntityModule } from '@app/entity/school-page/SchoolPageEntity.module';
import { SchoolPageDomain } from '@app/domain/school-page/SchoolPage.domain';
import { StudentSubscriptionSchoolPageService } from '../../../../../apps/external-api/src/student-subscription-school-page/StudentSubscriptionSchoolPage.service';
import { SchoolPageRepository } from '@app/entity/school-page/SchoolPage.repository';
import { SubscribeSchoolPageDto } from '../../../../../apps/external-api/src/student-subscription-school-page/dto/SubscribeSchoolPageDto';
import { StudentSubscriptionSchoolPageRepository } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.repository';
import { SchoolNewsEntity } from '@app/entity/school-news/SchoolNews.entity';
import { SchoolNewsDomain } from '@app/domain/school-news/SchoolNews.domain';
import { SchoolNewsEntityModule } from '@app/entity/school-news/SchoolNewsEntity.module';

describe('StudentSubscriptionSchoolPage Service', () => {
  let dataSource: DataSource;
  let schoolPageEntityRepository: Repository<SchoolPageEntity>;
  let studentSubscriptionSchoolPageEntityRepository: Repository<StudentSubscriptionSchoolPageEntity>;
  let schoolNewsEntityRepository: Repository<SchoolNewsEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        getTestMySQLTypeOrmModule(),
        StudentSubscriptionEntityModule,
        SchoolPageEntityModule,
        SchoolNewsEntityModule,
      ],
    }).compile();

    schoolPageEntityRepository = module.get(
      getRepositoryToken(SchoolPageEntity),
    );
    studentSubscriptionSchoolPageEntityRepository = module.get(
      getRepositoryToken(StudentSubscriptionSchoolPageEntity),
    );
    schoolNewsEntityRepository = module.get(
      getRepositoryToken(SchoolNewsEntity),
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await schoolPageEntityRepository.delete({});
    await studentSubscriptionSchoolPageEntityRepository.delete({});
    await schoolNewsEntityRepository.delete({});
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  const createSchoolPage = async (
    region: string = '서울',
    name: string = '청운',
    schoolId: number = 1,
  ) => {
    return await schoolPageEntityRepository.save(
      SchoolPageDomain.create({
        region,
        name,
        schoolId,
      }).toEntity(),
    );
  };

  const createSubscription = async (
    schoolPage: SchoolPageEntity,
    studentId: number = 1,
  ) => {
    const entity = new StudentSubscriptionSchoolPageEntity();
    entity.schoolPage = schoolPage;
    entity.studentId = studentId;
    return await studentSubscriptionSchoolPageEntityRepository.save(entity);
  };

  const createSchoolNews = async (
    schoolPage: SchoolPageEntity,
    title: string = 'title',
    content: string = 'content'.repeat(10),
  ) => {
    return await schoolNewsEntityRepository.save(
      SchoolNewsDomain.create({
        schoolPageId: schoolPage.id,
        title,
        content,
      }).toEntity(schoolPage),
    );
  };

  it('존재하지 않는 페이지 구독 불가', async () => {
    const studentId = 1;
    const schoolPageId = 1;
    const sut = new StudentSubscriptionSchoolPageService(
      studentSubscriptionSchoolPageEntityRepository,
      new SchoolPageRepository(schoolPageEntityRepository),
      new StudentSubscriptionSchoolPageRepository(
        studentSubscriptionSchoolPageEntityRepository,
      ),
      schoolNewsEntityRepository,
    );
    const subscribeSchoolPageDto = new SubscribeSchoolPageDto(1, 1);

    await expect(sut.subscribe(subscribeSchoolPageDto)).rejects.toThrow(
      new CustomError(ResponseStatus.NOT_FOUND, '존재하지 않는 페이지입니다'),
    );
  });

  it('학생은 학교 페이지를 구독할 수 있다', async () => {
    const studentId = 1;
    const schoolPage = await createSchoolPage();
    const sut = new StudentSubscriptionSchoolPageService(
      studentSubscriptionSchoolPageEntityRepository,
      new SchoolPageRepository(schoolPageEntityRepository),
      new StudentSubscriptionSchoolPageRepository(
        studentSubscriptionSchoolPageEntityRepository,
      ),
      schoolNewsEntityRepository,
    );
    const subscribeSchoolPageDto = new SubscribeSchoolPageDto(1, schoolPage.id);

    await sut.subscribe(subscribeSchoolPageDto);
    const subs = await studentSubscriptionSchoolPageEntityRepository.findOneBy({
      studentId,
      schoolPage: {
        id: schoolPage.id,
      },
    });

    expect(subs).not.toBeNull();
  });

  it('학생의 학교페이지 구독 취소 ', async () => {
    const studentId = 1;
    const schoolPage = await createSchoolPage();
    await createSubscription(schoolPage, studentId);
    const sut = new StudentSubscriptionSchoolPageService(
      studentSubscriptionSchoolPageEntityRepository,
      new SchoolPageRepository(schoolPageEntityRepository),
      new StudentSubscriptionSchoolPageRepository(
        studentSubscriptionSchoolPageEntityRepository,
      ),
      schoolNewsEntityRepository,
    );

    await sut.unsubscribe(studentId, schoolPage.id);
    const schoolPageBy =
      await studentSubscriptionSchoolPageEntityRepository.findOneBy({
        studentId,
        schoolPage: {
          id: schoolPage.id,
        },
      });

    expect(schoolPageBy).toBeNull();
  });

  it('구독중인 학교 페이지별 소식 조회 ', async () => {
    const studentId = 1;
    const schoolPage = await createSchoolPage();
    const title = 'title';
    const content = 'content';
    await createSchoolNews(schoolPage, title, content);
    await createSubscription(schoolPage, studentId);
    const sut = new StudentSubscriptionSchoolPageService(
      studentSubscriptionSchoolPageEntityRepository,
      new SchoolPageRepository(schoolPageEntityRepository),
      new StudentSubscriptionSchoolPageRepository(
        studentSubscriptionSchoolPageEntityRepository,
      ),
      schoolNewsEntityRepository,
    );

    const newsList = await sut.getSubscribingPageNewsByPageId(
      studentId,
      schoolPage.id,
    );

    expect(newsList[0].title).toBe(title);
    expect(newsList[0].content).toBe(content);
  });

  it('구독중이 아니라면 학교 페이지별 소식을 조회할 수 없습니다. ', async () => {
    const studentId = 1;
    const schoolPage = await createSchoolPage();
    const sut = new StudentSubscriptionSchoolPageService(
      studentSubscriptionSchoolPageEntityRepository,
      new SchoolPageRepository(schoolPageEntityRepository),
      new StudentSubscriptionSchoolPageRepository(
        studentSubscriptionSchoolPageEntityRepository,
      ),
      schoolNewsEntityRepository,
    );

    await expect(
      sut.getSubscribingPageNewsByPageId(studentId, schoolPage.id),
    ).rejects.toThrow(
      new CustomError(ResponseStatus.NOT_FOUND, '구독중인 페이지가 아닙니다.'),
    );
  });
});
