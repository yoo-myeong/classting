import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolNewsEntity } from '@app/entity/school-news/SchoolNews.entity';
import { SchoolNewsRepository } from '@app/entity/school-news/SchoolNews.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolNewsEntity])],
  providers: [SchoolNewsRepository],
  exports: [TypeOrmModule, SchoolNewsRepository],
})
export class SchoolNewsEntityModule {}
