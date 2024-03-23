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
import { getTestMySQLTypeOrmModule } from '../../../../getTestMySQLTypeOrmModule';
import { SchoolPageModule } from '../../../../../apps/external-api/src/school-page/SchoolPage.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseMappingInterceptor } from '@app/common-config/interceptor/response-mapping.interceptor';

describe('/schools/pages', () => {
  let app: INestApplication;
  let schoolPageEntityRepository: Repository<SchoolPageEntity>;

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

    app = App.create({
      app: module.createNestApplication(),
      name: 'external-api-test',
      nodeEnv: getNodeEnv(process.env.NODE_ENV),
    }).app;
    await app.init();
  });

  beforeEach(async () => {
    await schoolPageEntityRepository.delete({});
  });

  afterAll(async () => {
    await app.close();
  });

  it('[POST]/schools/pages, 인증되지 않은 학교 유저는 학교페이지를 생성할 수 없음', async () => {
    const body = {
      region: '서울',
      name: '현대',
    };

    const res = await request(app.getHttpServer())
      .post('/schools/pages')
      .send(body);

    expect(res.status).toBe(HttpStatus.FORBIDDEN);
  });

  it('[POST] /schools/pages', async () => {
    const body = {
      region: '서울',
      name: '현대',
    };
    const headers = {
      Authorization: 'test-token',
    };

    const res = await request(app.getHttpServer())
      .post('/schools/pages')
      .send(body)
      .set(headers);

    expect(res.status).toBe(HttpStatus.CREATED);
  });
});
