import { Module } from '@nestjs/common';
import { SchoolPageEntityModule } from '@app/entity/school-page/SchoolPageEntity.module';
import { StudentSubscriptionEntityModule } from '@app/entity/student-subscription-school-page/StudentSubscriptionEntity.module';
import { StudentSubscriptionSchoolPageService } from './StudentSubscriptionSchoolPage.service';

@Module({
  imports: [StudentSubscriptionEntityModule, SchoolPageEntityModule],
  providers: [StudentSubscriptionSchoolPageService],
})
export class StudentSubscriptionSchoolPageModule {}
