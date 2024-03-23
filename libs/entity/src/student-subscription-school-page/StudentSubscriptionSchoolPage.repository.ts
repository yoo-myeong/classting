import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentSubscriptionSchoolPageEntity } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.entity';
import { GetSchoolPagesByStudentIdResult } from '@app/entity/student-subscription-school-page/dto/GetSchoolPagesByStudentIdResult';
import { CustomError } from '@app/common-config/error/CustomError';
import { ResponseStatus } from '@app/common-config/res/ResponseStastus';

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

  async getSubscriptionByStudentIdAndSchoolId(
    studentId: number,
    schoolPageId: number,
  ) {
    const subscription =
      await this.studentSubscriptionSchoolPageEntityRepository.findOneBy({
        studentId,
        schoolPage: {
          id: schoolPageId,
        },
        deletedAt: null,
      });

    if (!subscription)
      throw new CustomError(
        ResponseStatus.NOT_FOUND,
        '구독중인 페이지가 아닙니다.',
      );

    return subscription;
  }
}
