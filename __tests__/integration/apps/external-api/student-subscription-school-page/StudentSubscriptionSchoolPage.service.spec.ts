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

describe('StudentSubscriptionSchoolPage Service', () => {
  let dataSource: DataSource;
  let schoolPageEntityRepository: Repository<SchoolPageEntity>;
  let studentSubscriptionSchoolPageEntityRepository: Repository<StudentSubscriptionSchoolPageEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        getTestMySQLTypeOrmModule(),
        StudentSubscriptionEntityModule,
        SchoolPageEntityModule,
      ],
    }).compile();

    schoolPageEntityRepository = module.get(
      getRepositoryToken(SchoolPageEntity),
    );
    studentSubscriptionSchoolPageEntityRepository = module.get(
      getRepositoryToken(StudentSubscriptionSchoolPageEntity),
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await schoolPageEntityRepository.delete({});
    await studentSubscriptionSchoolPageEntityRepository.delete({});
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  const createScPage = async (
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

  it('존재하지 않는 페이지 구독 불가', async () => {
    const studentId = 1;
    const scPgId = 1;
    const sut = new StudentSubscriptionSchoolPageService(
      studentSubscriptionSchoolPageEntityRepository,
      new SchoolPageRepository(schoolPageEntityRepository),
    );
    const subscribeSchoolPageDto = new SubscribeSchoolPageDto(1, 1);

    await expect(sut.subscribe(subscribeSchoolPageDto)).rejects.toThrow(
      new CustomError(ResponseStatus.NOT_FOUND, '존재하지 않는 페이지입니다'),
    );
  });

  it('학생은 학교 페이지를 구독할 수 있다', async () => {
    const studentId = 1;
    const schoolPage = await createScPage();
    const sut = new StudentSubscriptionSchoolPageService(
      studentSubscriptionSchoolPageEntityRepository,
      new SchoolPageRepository(schoolPageEntityRepository),
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
});
