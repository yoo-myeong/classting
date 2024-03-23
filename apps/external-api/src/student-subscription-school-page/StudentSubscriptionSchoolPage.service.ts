import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentSubscriptionSchoolPageEntity } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.entity';
import { SchoolPageRepository } from '@app/entity/school-page/SchoolPage.repository';
import { StudentSubscriptionSchoolPageRepository } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.repository';
import { SubscribeSchoolPageDto } from './dto/SubscribeSchoolPageDto';
import { GetSubscribingSchoolPagesResult } from './dto/GetSubscribingSchoolPagesResult';

@Injectable()
export class StudentSubscriptionSchoolPageService {
  constructor(
    @InjectRepository(StudentSubscriptionSchoolPageEntity)
    private readonly studentSubscriptionSchoolPageEntityRepository: Repository<StudentSubscriptionSchoolPageEntity>,

    private readonly schoolPageRepository: SchoolPageRepository,

    private readonly studentSubscriptionSchoolPageRepository: StudentSubscriptionSchoolPageRepository,
  ) {}

  async subscribe(dto: SubscribeSchoolPageDto) {
    const schoolPage = await this.schoolPageRepository.getById(
      dto.schoolPageId,
    );
    await this.studentSubscriptionSchoolPageEntityRepository.insert(
      dto.toEntity(schoolPage),
    );
  }

  async getSubscribingSchoolPages(studentId: number) {
    const schoolPages =
      await this.studentSubscriptionSchoolPageRepository.getSubscribingSchoolPagesByStudentId(
        studentId,
      );
    return schoolPages.map(
      (it) =>
        new GetSubscribingSchoolPagesResult({
          id: it.id,
          region: it.region,
          schoolName: it.schoolName,
        }),
    );
  }

  async unsubscribe(studentId: number, schoolPageId: number) {
    const subscription =
      await this.studentSubscriptionSchoolPageRepository.getSubscriptionByStudentIdAndSchoolId(
        studentId,
        schoolPageId,
      );

    await this.studentSubscriptionSchoolPageEntityRepository.softDelete(
      subscription.id,
    );
  }
}
