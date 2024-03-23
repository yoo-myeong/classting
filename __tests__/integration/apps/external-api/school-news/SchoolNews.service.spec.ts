import { DataSource, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';
import { SchoolNewsEntity } from '@app/entity/school-news/SchoolNews.entity';
import { getTestMySQLTypeOrmModule } from '../../../../getTestMySQLTypeOrmModule';
import { SchoolPageEntityModule } from '@app/entity/school-page/SchoolPageEntity.module';
import { SchoolNewsEntityModule } from '@app/entity/school-news/SchoolNewsEntity.module';
import { SchoolPageDomain } from '@app/domain/school-page/SchoolPage.domain';
import { SchoolNewsDomain } from '@app/domain/school-news/SchoolNews.domain';
import { SchoolNewsService } from '../../../../../apps/external-api/src/school-news/SchoolNews.service';
import { SchoolPageRepository } from '@app/entity/school-page/SchoolPage.repository';
import { SchoolNewsRepository } from '@app/entity/school-news/SchoolNews.repository';
import { UpdateSchoolNewsDto } from '../../../../../apps/external-api/src/school-news/dto/UpdateSchoolNewsDto';

describe('School News service', () => {
  let dataSource: DataSource;
  let schoolPageEntityRepository: Repository<SchoolPageEntity>;
  let schoolNewsEntityRepository: Repository<SchoolNewsEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        getTestMySQLTypeOrmModule(),
        SchoolPageEntityModule,
        SchoolNewsEntityModule,
      ],
    }).compile();

    schoolPageEntityRepository = module.get(
      getRepositoryToken(SchoolPageEntity),
    );
    schoolNewsEntityRepository = module.get(
      getRepositoryToken(SchoolNewsEntity),
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await schoolPageEntityRepository.delete({});
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

  it('School News 생성', async () => {
    const schoolPage = await createSchoolPage();
    const title = '제목';
    const content = '내용'.repeat(50);
    const schoolPageId = schoolPage.id;
    const sut = new SchoolNewsService(
      schoolNewsEntityRepository,
      new SchoolPageRepository(schoolPageEntityRepository),
      new SchoolNewsRepository(schoolNewsEntityRepository),
    );

    await sut.createSchoolNews(
      SchoolNewsDomain.create({
        title,
        content,
        schoolPageId,
      }),
    );
    const schoolNews = await schoolNewsEntityRepository.findOne({
      where: {
        title,
        content,
        schoolPage: {
          id: schoolPageId,
        },
      },
    });

    expect(schoolNews.title).toBe(title);
    expect(schoolNews.content).toBe(content);
  });

  it('School News 삭제', async () => {
    const schoolPage = await createSchoolPage();
    const schoolNews = await createSchoolNews(
      schoolPage,
      'title',
      'content'.repeat(10),
    );
    const sut = new SchoolNewsService(
      schoolNewsEntityRepository,
      new SchoolPageRepository(schoolPageEntityRepository),
      new SchoolNewsRepository(schoolNewsEntityRepository),
    );

    await sut.deleteById(schoolNews.id);
    const updateScNew = await schoolNewsEntityRepository.findOneBy({
      id: schoolNews.id,
    });

    expect(updateScNew).toBeNull();
  });

  it('학교 소식 수정', async () => {
    const schoolPage = await createSchoolPage();
    const schoolNews = await createSchoolNews(
      schoolPage,
      'title',
      'content'.repeat(10),
    );
    const sut = new SchoolNewsService(
      schoolNewsEntityRepository,
      new SchoolPageRepository(schoolPageEntityRepository),
      new SchoolNewsRepository(schoolNewsEntityRepository),
    );
    const updateTitle = 'title2';
    const updateContent = 'content2'.repeat(10);
    const updateSchoolNewsDto = new UpdateSchoolNewsDto({
      id: schoolNews.id,
      title: updateTitle,
      content: updateContent,
    });

    await sut.updateSchoolNews(updateSchoolNewsDto);
    const updateScNew = await schoolNewsEntityRepository.findOneBy({
      id: schoolNews.id,
    });

    expect(updateScNew.title).toBe(updateTitle);
    expect(updateScNew.content).toBe(updateContent);
  });
});
