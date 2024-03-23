import { Module } from '@nestjs/common';
import { SchoolPageEntityModule } from '@app/entity/school-page/SchoolPageEntity.module';
import { SchoolPageService } from './SchoolPage.service';

@Module({
  imports: [SchoolPageEntityModule],
  providers: [SchoolPageService],
})
export class SchoolPageModule {}
