import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolPageEntity])],
  exports: [TypeOrmModule],
})
export class SchoolPageEntityModule {}
