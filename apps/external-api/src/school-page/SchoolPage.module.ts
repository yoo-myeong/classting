import { Module } from '@nestjs/common';
import { SchoolPageEntityModule } from '@app/entity/school-page/SchoolPageEntity.module';
import { SchoolPageService } from './SchoolPage.service';
import { SchoolPageController } from './SchoolPage.controller';

@Module({
  imports: [SchoolPageEntityModule],
  controllers: [SchoolPageController],
  providers: [SchoolPageService],
})
export class SchoolPageModule {}
