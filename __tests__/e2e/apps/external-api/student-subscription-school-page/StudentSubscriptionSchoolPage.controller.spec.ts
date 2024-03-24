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
import { StudentSubscriptionSchoolPageEntity } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.entity';
import { getTestMySQLTypeOrmModule } from '../../../../getTestMySQLTypeOrmModule';
import { SchoolPageModule } from '../../../../../apps/external-api/src/school-page/SchoolPage.module';
import { StudentSubscriptionSchoolPageModule } from '../../../../../apps/external-api/src/student-subscription-school-page/StudentSubscriptionSchoolPage.module';
import { SchoolPageDomain } from '@app/domain/school-page/SchoolPage.domain';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseMappingInterceptor } from '@app/common-config/interceptor/response-mapping.interceptor';
import { SchoolNewsEntityModule } from '@app/entity/school-news/SchoolNewsEntity.module';
import { SchoolNewsDomain } from '@app/domain/school-news/SchoolNews.domain';
import { SchoolNewsEntity } from '@app/entity/school-news/SchoolNews.entity';

describe('/students/subscriptions', () => {
  let app: INestApplication;
  let schoolPageEntityRepository: Repository<SchoolPageEntity>;
  let studentSubscriptionSchoolPageEntityRepository: Repository<StudentSubscriptionSchoolPageEntity>;
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
        StudentSubscriptionSchoolPageModule,
      ],
      providers: [
        Logger,
        {
          provide: APP_INTERCEPTOR,
          useClass: ResponseMappingInterceptor,
        },
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

    app = App.create({
      app: module.createNestApplication(),
      name: 'external-api-test',
      nodeEnv: getNodeEnv(process.env.NODE_ENV),
    }).app;
    await app.init();
  });

  beforeEach(async () => {
    await schoolPageEntityRepository.delete({});
    await studentSubscriptionSchoolPageEntityRepository.delete({});
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

  const createSubscription = async (
    schoolPage: SchoolPageEntity,
    studentId: number = 1,
  ) => {
    const entity = new StudentSubscriptionSchoolPageEntity();
    entity.schoolPage = schoolPage;
    entity.studentId = studentId;
    return await studentSubscriptionSchoolPageEntityRepository.save(entity);
  };

  it('[POST] /students/subscriptions', async () => {
    const schoolPage = await createSchoolPage();
    const reqBody = {
      schoolPageId: schoolPage.id,
    };

    const res = await request(app.getHttpServer())
      .post(`/students/subscriptions`)
      .set('X-Authorization', 'test-token')
      .send(reqBody);

    expect(res.status).toBe(HttpStatus.CREATED);
  });

  it('[GET] /students/subscriptions/pages', async () => {
    const region = '경기';
    const schoolPage = await createSchoolPage(region);
    const subscription = createSubscription(schoolPage);

    const res = await request(app.getHttpServer())
      .get(`/students/subscriptions/pages`)
      .set('X-Authorization', 'test-token');
    const data = res.body.data;

    expect(res.status).toBe(HttpStatus.OK);
    expect(data[0].region).toBe(region);
  });

  it('[DELETE] /students/subscriptions/pages/:pageId', async () => {
    const region = '경기';
    const schoolPage = await createSchoolPage(region);
    const subscription = createSubscription(schoolPage);

    const res = await request(app.getHttpServer())
      .delete(`/students/subscriptions/pages/${schoolPage.id}`)
      .set('X-Authorization', 'test-token');

    expect(res.status).toBe(HttpStatus.OK);
  });

  it('[GET] /students/subscriptions/pages/:pageId/news', async () => {
    const region = '경기';
    const schoolPage = await createSchoolPage(region);
    const subscription = createSubscription(schoolPage);
    const title = 'title';
    await createSchoolNews(schoolPage, title);

    const res = await request(app.getHttpServer())
      .get(`/students/subscriptions/pages/${schoolPage.id}/news`)
      .set('X-Authorization', 'test-token');

    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.data[0].title).toBe(title);
  });

  it('[GET] /students/news-feed', async () => {
    const schoolPage = await createSchoolPage();
    await createSubscription(schoolPage);
    const news = await createSchoolNews(schoolPage);

    const res = await request(app.getHttpServer())
      .get(`/students/news-feed`)
      .set('X-Authorization', 'test-token');
    const data = res.body.data;

    expect(res.status).toBe(HttpStatus.OK);
    expect(data.length).toBe(1);
    expect(data[0].title).toBe(news.title);
    expect(data[0].content).toBe(news.content);
  });
});
