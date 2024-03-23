import { DataSource, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getTestMySQLTypeOrmModule } from '../../../../getTestMySQLTypeOrmModule';
import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';
import { SchoolPageEntityModule } from '@app/entity/school-page/SchoolPageEntity.module';
import { CustomError } from '@app/common-config/error/CustomError';
import { ResponseStatus } from '@app/common-config/res/ResponseStastus';
import { SchoolPageRepository } from '@app/entity/school-page/SchoolPage.repository';

describe('School Page Repository', () => {
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

  it('함수 호출 시,존재하지 않으면 에러', async () => {
    const sut = new SchoolPageRepository(schoolPageEntityRepository);

    await expect(sut.getById(1)).rejects.toThrow(
      new CustomError(ResponseStatus.NOT_FOUND, '존재하지 않는 페이지입니다'),
    );
  });
});
