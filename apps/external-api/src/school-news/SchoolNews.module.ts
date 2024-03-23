import { Module } from '@nestjs/common';
import { SchoolNewsEntityModule } from '@app/entity/school-news/SchoolNewsEntity.module';
import { SchoolPageEntityModule } from '@app/entity/school-page/SchoolPageEntity.module';
import { SchoolNewsService } from './SchoolNews.service';

@Module({
  imports: [SchoolNewsEntityModule, SchoolPageEntityModule],
  providers: [SchoolNewsService],
})
export class SchoolNewsModule {}
