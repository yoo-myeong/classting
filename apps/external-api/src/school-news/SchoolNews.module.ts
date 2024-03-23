import { Module } from '@nestjs/common';
import { SchoolNewsEntityModule } from '@app/entity/school-news/SchoolNewsEntity.module';
import { SchoolPageEntityModule } from '@app/entity/school-page/SchoolPageEntity.module';
import { SchoolNewsService } from './SchoolNews.service';
import { SchoolNewsController } from './SchoolNews.controller';

@Module({
  imports: [SchoolNewsEntityModule, SchoolPageEntityModule],
  controllers: [SchoolNewsController],
  providers: [SchoolNewsService],
})
export class SchoolNewsModule {}
