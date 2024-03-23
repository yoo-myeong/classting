import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentSubscriptionSchoolPageEntity } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.entity';
import { StudentSubscriptionSchoolPageRepository } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StudentSubscriptionSchoolPageEntity])],
  providers: [StudentSubscriptionSchoolPageRepository],
  exports: [TypeOrmModule],
})
export class StudentSubscriptionEntityModule {}
