import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolNewsEntity } from '@app/entity/school-news/SchoolNews.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolNewsEntity])],
  exports: [TypeOrmModule],
})
export class SchoolNewsEntityModule {}
