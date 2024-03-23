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

describe('StudentSubscriptionSchoolPage Repository', () => {
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

  const createSubscriptionSchoolPage = async (
    studentId: number,
    schoolPage: SchoolPageEntity,
  ) => {
    return await studentSubscriptionSchoolPageEntityRepository.save(
      new SubscribeSchoolPageDto(studentId, schoolPage.id).toEntity(schoolPage),
    );
  };

  it('get Subscribing School Pages By StudentId', async () => {
    const studentId = 1;
    const schoolPage1 = await createSchoolPage('경기', '문산', studentId);
    const schoolPage2 = await createSchoolPage('대전', '화암', studentId);
    await createSubscriptionSchoolPage(studentId, schoolPage1);
    await createSubscriptionSchoolPage(studentId, schoolPage2);
    const sut = new StudentSubscriptionSchoolPageRepository(
      studentSubscriptionSchoolPageEntityRepository,
    );

    const subPgs = await sut.getSubscribingSchoolPagesByStudentId(studentId);

    expect(subPgs[0].region).toBe(schoolPage2.region);
    expect(subPgs[0].schoolName).toBe(schoolPage2.name);
    expect(subPgs[1].region).toBe(schoolPage1.region);
    expect(subPgs[1].schoolName).toBe(schoolPage1.name);
  });
});
