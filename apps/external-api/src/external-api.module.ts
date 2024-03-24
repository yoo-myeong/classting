import { Logger, Module } from '@nestjs/common';
import process from 'process';
import { ConfigModule } from '@nestjs/config';
import { getConfiguration } from '@app/common-config/getConfiguration';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseMappingInterceptor } from '@app/common-config/interceptor/response-mapping.interceptor';
import { AllExceptionsFilter } from '@app/common-config/filter/api/all-expcpetion.filter';
import { BadParameterFilter } from '@app/common-config/filter/api/bad-parameter.filter';
import { NotFoundExceptionsFilter } from '@app/common-config/filter/api/not-found-exceptions.filter';
import { ForbiddenExceptionFilter } from '@app/common-config/filter/api/forbidden-exception.filter';
import { UnauthorizedExceptionFilter } from '@app/common-config/filter/api/unauthorized-exception.filter';
import { getMySQLTypeOrmModule } from '@app/entity/getMySQLTypeOrmModule';
import { CustomErrorFilter } from '@app/common-config/filter/api/custom-error.filter';
import { SchoolPageModule } from './school-page/SchoolPage.module';
import { SchoolNewsModule } from './school-news/SchoolNews.module';
import { StudentSubscriptionSchoolPageModule } from './student-subscription-school-page/StudentSubscriptionSchoolPage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [getConfiguration],
      isGlobal: true,
    }),
    getMySQLTypeOrmModule(),
    SchoolPageModule,
    SchoolNewsModule,
    StudentSubscriptionSchoolPageModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseMappingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: CustomErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: BadParameterFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ForbiddenExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
  ],
})
export class ExternalApiModule {}
