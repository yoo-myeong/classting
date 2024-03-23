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

describe('/school/page', () => {
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
      providers: [Logger],
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

  it('[POST]/school/page, 인증되지 않은 학교 유저는 학교페이지를 생성할 수 없음', async () => {
    const body = {
      region: '서울',
      name: '현대',
    };

    const res = await request(app.getHttpServer())
      .post('/school/page')
      .send(body);

    expect(res.status).toBe(HttpStatus.FORBIDDEN);
  });

  it('[POST] /school/page', async () => {
    const body = {
      region: '서울',
      name: '현대',
    };
    const headers = {
      Authorization: 'test-token',
    };

    const res = await request(app.getHttpServer())
      .post('/school/page')
      .send(body)
      .set(headers);

    expect(res.status).toBe(HttpStatus.CREATED);
  });
});
