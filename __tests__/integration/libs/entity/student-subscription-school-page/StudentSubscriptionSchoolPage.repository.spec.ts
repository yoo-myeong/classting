import { DataSource, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getTestMySQLTypeOrmModule } from '../../../../getTestMySQLTypeOrmModule';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';
import { StudentSubscriptionSchoolPageEntity } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.entity';
import { StudentSubscriptionEntityModule } from '@app/entity/student-subscription-school-page/StudentSubscriptionEntity.module';
import { SchoolPageEntityModule } from '@app/entity/school-page/SchoolPageEntity.module';
import { SchoolPageDomain } from '@app/domain/school-page/SchoolPage.domain';
import { SubscribeSchoolPageDto } from '../../../../../apps/external-api/src/student-subscription-school-page/dto/SubscribeSchoolPageDto';
import { StudentSubscriptionSchoolPageRepository } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.repository';
import { CustomError } from '@app/common-config/error/CustomError';
import { ResponseStatus } from '@app/common-config/res/ResponseStastus';
import { SchoolNewsDomain } from '@app/domain/school-news/SchoolNews.domain';
import { SchoolNewsEntity } from '@app/entity/school-news/SchoolNews.entity';
import { SchoolNewsEntityModule } from '@app/entity/school-news/SchoolNewsEntity.module';

describe('StudentSubscriptionSchoolPage Repository', () => {
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

  it('get Subscribing School Pages By StudentId', async () => {
    const studentId = 1;
    const schoolPage1 = await createSchoolPage('경기', '문산', studentId);
    const schoolPage2 = await createSchoolPage('대전', '화암', studentId);
    await createSubscription(schoolPage1, studentId);
    await createSubscription(schoolPage2, studentId);
    const sut = new StudentSubscriptionSchoolPageRepository(
      studentSubscriptionSchoolPageEntityRepository,
    );

    const subPgs = await sut.getSubscribingSchoolPagesByStudentId(studentId);

    expect(subPgs[0].region).toBe(schoolPage2.region);
    expect(subPgs[0].schoolName).toBe(schoolPage2.name);
    expect(subPgs[1].region).toBe(schoolPage1.region);
    expect(subPgs[1].schoolName).toBe(schoolPage1.name);
  });

  it('id로 구독페이지 조회 시, 구독중인 페이지가 아니면 에러', async () => {
    const sut = new StudentSubscriptionSchoolPageRepository(
      studentSubscriptionSchoolPageEntityRepository,
    );

    await expect(
      sut.getSubscriptionByStudentIdAndSchoolId(1, 1),
    ).rejects.toThrow(
      new CustomError(ResponseStatus.NOT_FOUND, '구독중인 페이지가 아닙니다.'),
    );
  });

  it('뉴스피드 조회 시, 구독을 한 이후의 소식만 포함', async () => {
    const schoolPage = await createSchoolPage();
    const schoolNews1 = await createSchoolNews(
      schoolPage,
      'title1',
      'content1',
    );
    const subscription = await createSubscription(schoolPage);
    const schoolNews2 = await createSchoolNews(
      schoolPage,
      'title2',
      'content2',
    );
    const schoolNews3 = await createSchoolNews(
      schoolPage,
      'title3',
      'content3',
    );

    const sut = new StudentSubscriptionSchoolPageRepository(
      studentSubscriptionSchoolPageEntityRepository,
    );
    const newsfeeds = await sut.getNewsFeeds(subscription.studentId);

    expect(newsfeeds.length).toBe(2);
    expect(newsfeeds[0].title).toBe(schoolNews3.title);
    expect(newsfeeds[0].content).toBe(schoolNews3.content);
    expect(newsfeeds[1].title).toBe(schoolNews2.title);
    expect(newsfeeds[1].content).toBe(schoolNews2.content);
  });

  it('뉴스피드 조회 시, 구독을 취소해도 기존 뉴스피드의 소식을 유지 ', async () => {
    const schoolPage = await createSchoolPage();
    const schoolNews1 = await createSchoolNews(
      schoolPage,
      'title1',
      'content1',
    );
    const subscription = await createSubscription(schoolPage);
    const schoolNews2 = await createSchoolNews(
      schoolPage,
      'title2',
      'content2',
    );
    await new Promise((r) => setTimeout(r, 1000));
    await studentSubscriptionSchoolPageEntityRepository.softDelete(
      subscription.id,
    );
    const schoolNews3 = await createSchoolNews(
      schoolPage,
      'title3',
      'content3',
    );

    const sut = new StudentSubscriptionSchoolPageRepository(
      studentSubscriptionSchoolPageEntityRepository,
    );
    const newsfeeds = await sut.getNewsFeeds(subscription.studentId);

    expect(newsfeeds.length).toBe(1);
    expect(newsfeeds[0].title).toBe(schoolNews2.title);
    expect(newsfeeds[0].content).toBe(schoolNews2.content);
  });
});
