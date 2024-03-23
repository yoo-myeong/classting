import { Module } from '@nestjs/common';
import { SchoolPageEntityModule } from '@app/entity/school-page/SchoolPageEntity.module';
import { StudentSubscriptionEntityModule } from '@app/entity/student-subscription-school-page/StudentSubscriptionEntity.module';
import { SchoolNewsEntityModule } from '@app/entity/school-news/SchoolNewsEntity.module';
import { StudentSubscriptionSchoolPageService } from './StudentSubscriptionSchoolPage.service';
import { StudentSubscriptionSchoolPageController } from './StudentSubscriptionSchoolPage.controller';

@Module({
  imports: [
    StudentSubscriptionEntityModule,
    SchoolPageEntityModule,
    SchoolNewsEntityModule,
  ],
  controllers: [StudentSubscriptionSchoolPageController],
  providers: [StudentSubscriptionSchoolPageService],
})
export class StudentSubscriptionSchoolPageModule {}
