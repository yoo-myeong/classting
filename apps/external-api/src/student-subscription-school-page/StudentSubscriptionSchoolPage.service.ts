import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentSubscriptionSchoolPageEntity } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.entity';
import { SchoolPageRepository } from '@app/entity/school-page/SchoolPage.repository';
import { StudentSubscriptionSchoolPageRepository } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.repository';
import { SubscribeSchoolPageDto } from './dto/SubscribeSchoolPageDto';

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

  async getSubscribingSchoolPages(stId: number) {
    return this.studentSubscriptionSchoolPageRepository.getSubscribingSchoolPagesByStudentId(
      stId,
    );
  }
}
