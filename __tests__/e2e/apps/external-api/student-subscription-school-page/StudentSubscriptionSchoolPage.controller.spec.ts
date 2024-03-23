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
import { StudentSubscriptionSchoolPageEntity } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.entity';
import { getTestMySQLTypeOrmModule } from '../../../../getTestMySQLTypeOrmModule';
import { SchoolPageModule } from '../../../../../apps/external-api/src/school-page/SchoolPage.module';
import { SchoolNewsModule } from '../../../../../apps/external-api/src/school-news/SchoolNews.module';
import { StudentSubscriptionSchoolPageModule } from '../../../../../apps/external-api/src/student-subscription-school-page/StudentSubscriptionSchoolPage.module';
import { SchoolPageDomain } from '@app/domain/school-page/SchoolPage.domain';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseMappingInterceptor } from '@app/common-config/interceptor/response-mapping.interceptor';

describe('/st/sub', () => {
  let app: INestApplication;
  let schoolPageEntityRepository: Repository<SchoolPageEntity>;
  let studentSubscriptionSchoolPageEntityRepository: Repository<StudentSubscriptionSchoolPageEntity>;

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

  it('[POST] /students/subscriptions', async () => {
    const schoolPage = await createSchoolPage();
    const reqBody = {
      schoolPageId: schoolPage.id,
    };

    const res = await request(app.getHttpServer())
      .post(`/students/subscriptions`)
      .set('Authorization', 'test-token')
      .send(reqBody);

    expect(res.status).toBe(HttpStatus.CREATED);
  });

  it('[GET] /students/subscriptions/pages', async () => {
    const region = '경기';
    const schoolPage = await createSchoolPage(region);
    await studentSubscriptionSchoolPageEntityRepository.insert({
      studentId: 1,
      schoolPage,
    });

    const res = await request(app.getHttpServer())
      .get(`/students/subscriptions/pages`)
      .set('Authorization', 'test-token');
    const data = res.body.data;

    expect(res.status).toBe(HttpStatus.OK);
    expect(data[0].region).toBe(region);
  });
});
