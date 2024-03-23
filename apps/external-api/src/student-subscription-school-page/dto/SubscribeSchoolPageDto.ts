import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';
import { StudentSubscriptionSchoolPageEntity } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.entity';

export class SubscribeSchoolPageDto {
  private readonly schoolId: number;

  private readonly _schoolPageId: number;

  constructor(studentId: number, schoolPageId: number) {
    this.schoolId = studentId;
    this._schoolPageId = schoolPageId;
  }

  get schoolPageId() {
    return this._schoolPageId;
  }

  toEntity(schoolPage: SchoolPageEntity) {
    const entity = new StudentSubscriptionSchoolPageEntity();
    entity.studentId = this.schoolId;
    entity.schoolPage = schoolPage;

    return entity;
  }
}
