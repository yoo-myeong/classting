import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentSubscriptionSchoolPageEntity } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentSubscriptionSchoolPageEntity])],
  exports: [TypeOrmModule],
})
export class StudentSubscriptionEntityModule {}
