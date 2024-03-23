import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScNewsEntity } from '@app/entity/sc-news/sc-news.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScNewsEntity])],
  exports: [TypeOrmModule],
})
export class SchoolNewsEntityModule {}
