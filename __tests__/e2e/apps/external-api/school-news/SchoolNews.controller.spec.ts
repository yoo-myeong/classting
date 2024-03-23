import { HttpStatus, INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { getConfiguration } from '@app/common-config/getConfiguration';
import { App } from '@app/common-config/setApp';
import { getNodeEnv } from '@app/common-config/NodeEnv';
import process from 'process';
import request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';
import { SchoolNewsEntity } from '@app/entity/school-news/SchoolNews.entity';
import { getTestMySQLTypeOrmModule } from '../../../../getTestMySQLTypeOrmModule';
import { SchoolPageModule } from '../../../../../apps/external-api/src/school-page/SchoolPage.module';
import { SchoolNewsModule } from '../../../../../apps/external-api/src/school-news/SchoolNews.module';
import { SchoolPageDomain } from '@app/domain/school-page/SchoolPage.domain';
import { SchoolNewsDomain } from '@app/domain/school-news/SchoolNews.domain';

describe('/schools/pages/:pageId/news', () => {
  let app: INestApplication;
  let schoolPageEntityRepository: Repository<SchoolPageEntity>;
  let schoolNewsEntityRepository: Repository<SchoolNewsEntity>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env.local`,
          load: [getConfiguration],
          isGlobal: true,
        }),
        getTestMySQLTypeOrmModule(),
        SchoolPageModule,
        SchoolNewsModule,
      ],
      providers: [Logger],
    }).compile();

    schoolPageEntityRepository = module.get(
      getRepositoryToken(SchoolPageEntity),
    );
    schoolNewsEntityRepository = module.get(
      getRepositoryToken(SchoolNewsEntity),
    );

    app = App.create({
      app: module.createNestApplication(),
      name: 'external-api-test',
      nodeEnv: getNodeEnv(process.env.NODE_ENV),
    }).app;
    await app.init();
  });

  beforeEach(async () => {
    await schoolPageEntityRepository.delete({});
    await schoolNewsEntityRepository.delete({});
  });

  afterAll(async () => {
    await app.close();
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

  it('[POST] /schools/pages/:pageId/news', async () => {
    const schoolPage = await createSchoolPage();
    const reqBody = {
      title: 'title',
      content: 'content'.repeat(10),
    };

    const res = await request(app.getHttpServer())
      .post(`/schools/pages/${schoolPage.id}/news`)
      .set('Authorization', 'test-token')
      .send(reqBody);

    expect(res.status).toBe(HttpStatus.CREATED);
  });

  it('[DELETE] /schools/pages/:pageId/news', async () => {
    const schoolPage = await createSchoolPage();
    const schoolNews = await createSchoolNews(schoolPage);

    const res = await request(app.getHttpServer())
      .delete(`/schools/pages/${schoolPage.id}/news/${schoolNews.id}`)
      .set('Authorization', 'test-token');

    expect(res.status).toBe(HttpStatus.OK);
  });

  it('[PATCH]/sc/page/:pageId/new/:newId', async () => {
    const schoolPage = await createSchoolPage();
    const schoolNews = await createSchoolNews(schoolPage);
    const reqBody = {
      title: 'title2',
      content: 'content2'.repeat(10),
    };

    const res = await request(app.getHttpServer())
      .patch(`/schools/pages/${schoolPage.id}/news/${schoolNews.id}`)
      .set('Authorization', 'test-token')
      .send(reqBody);

    expect(res.status).toBe(HttpStatus.OK);
  });
});
