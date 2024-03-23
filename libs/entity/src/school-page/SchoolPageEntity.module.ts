import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';
import { SchoolPageRepository } from '@app/entity/school-page/SchoolPage.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolPageEntity])],
  providers: [SchoolPageRepository],
  exports: [TypeOrmModule, SchoolPageRepository],
})
export class SchoolPageEntityModule {}
