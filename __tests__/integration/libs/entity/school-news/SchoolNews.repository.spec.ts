import { DataSource, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomError } from '@app/common-config/error/CustomError';
import { getTestMySQLTypeOrmModule } from '../../../../getTestMySQLTypeOrmModule';
import { ResponseStatus } from '@app/common-config/res/ResponseStastus';
import { SchoolNewsEntity } from '@app/entity/school-news/SchoolNews.entity';
import { SchoolNewsEntityModule } from '@app/entity/school-news/SchoolNewsEntity.module';
import { SchoolNewsRepository } from '@app/entity/school-news/SchoolNews.repository';

describe('School News Repository', () => {
  let dataSource: DataSource;
  let schoolNewsEntityRepository: Repository<SchoolNewsEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [getTestMySQLTypeOrmModule(), SchoolNewsEntityModule],
    }).compile();

    schoolNewsEntityRepository = module.get(
      getRepositoryToken(SchoolNewsEntity),
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await schoolNewsEntityRepository.delete({});
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('등록된 학교 소식인지 확인', async () => {
    const sut = new SchoolNewsRepository(schoolNewsEntityRepository);

    await expect(sut.getSchoolNewsById(1)).rejects.toThrow(
      new CustomError(ResponseStatus.NOT_FOUND, '존재하지 않는 소식입니다.'),
    );
  });
});
