import { DataSource, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';
import { getTestMySQLTypeOrmModule } from '../../../../getTestMySQLTypeOrmModule';
import { SchoolPageEntityModule } from '@app/entity/school-page/SchoolPageEntity.module';
import { SchoolPageDomain } from '@app/domain/school-page/SchoolPage.domain';
import { SchoolPageService } from '../../../../../apps/external-api/src/school-page/SchoolPage.service';

describe('School Page Service', () => {
  let dataSource: DataSource;
  let schoolPageEntityRepository: Repository<SchoolPageEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [getTestMySQLTypeOrmModule(), SchoolPageEntityModule],
    }).compile();

    schoolPageEntityRepository = module.get(
      getRepositoryToken(SchoolPageEntity),
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await schoolPageEntityRepository.delete({});
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('school page 생성', async () => {
    const region = '서울';
    const name = '현대';
    const domain = SchoolPageDomain.create({
      region,
      name,
      schoolId: 1,
    });
    const sut = new SchoolPageService(schoolPageEntityRepository);

    await sut.createSchoolPage(domain);
    const schoolPage = await schoolPageEntityRepository.findOneBy({
      region,
      name,
    });

    expect(schoolPage.region).toBe(region);
    expect(schoolPage.name).toBe(name);
  });
});
