import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';
import { StudentSubscriptionSchoolPageEntity } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.entity';

export class SubscribeSchoolPageDto {
  private readonly _studentId: number;

  private readonly _schoolPageId: number;

  constructor(studentId: number, schoolPageId: number) {
    this._studentId = studentId;
    this._schoolPageId = schoolPageId;
  }

  get schoolPageId() {
    return this._schoolPageId;
  }

  toEntity(schoolPage: SchoolPageEntity) {
    const entity = new StudentSubscriptionSchoolPageEntity();
    entity.studentId = this._studentId;
    entity.schoolPage = schoolPage;

    return entity;
  }
}
