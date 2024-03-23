import { Module } from '@nestjs/common';
import { SchoolPageEntityModule } from '@app/entity/school-page/SchoolPageEntity.module';
import { StudentSubscriptionEntityModule } from '@app/entity/student-subscription-school-page/StudentSubscriptionEntity.module';
import { StudentSubscriptionSchoolPageService } from './StudentSubscriptionSchoolPage.service';
import { StudentSubscriptionSchoolPageController } from './StudentSubscriptionSchoolPageController';

@Module({
  imports: [StudentSubscriptionEntityModule, SchoolPageEntityModule],
  controllers: [StudentSubscriptionSchoolPageController],
  providers: [StudentSubscriptionSchoolPageService],
})
export class StudentSubscriptionSchoolPageModule {}