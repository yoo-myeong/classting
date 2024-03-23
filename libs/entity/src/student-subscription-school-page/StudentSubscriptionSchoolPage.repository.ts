import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentSubscriptionSchoolPageEntity } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.entity';
import { GetSchoolPagesByStudentIdResult } from '@app/entity/student-subscription-school-page/dto/GetSchoolPagesByStudentIdResult';

@Injectable()
export class StudentSubscriptionSchoolPageRepository {
  constructor(
    @InjectRepository(StudentSubscriptionSchoolPageEntity)
    private readonly studentSubscriptionSchoolPageEntityRepository: Repository<StudentSubscriptionSchoolPageEntity>,
  ) {}

  async getSubscribingSchoolPagesByStudentId(studentId: number) {
    const sub = await this.studentSubscriptionSchoolPageEntityRepository
      .createQueryBuilder('ss')
      .innerJoinAndSelect('ss.schoolPage', 'sp')
      .where('ss.studentId=:studentId', { studentId })
      .andWhere('ss.deletedAt is null')
      .orderBy('ss.createdAt', 'DESC')
      .getMany();

    return sub.map(
      (it) =>
        new GetSchoolPagesByStudentIdResult({
          id: it.schoolPage.id,
          region: it.schoolPage.region,
          schoolName: it.schoolPage.name,
        }),
    );
  }
}
