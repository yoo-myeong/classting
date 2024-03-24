import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentSubscriptionSchoolPageEntity } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.entity';
import { SchoolPageRepository } from '@app/entity/school-page/SchoolPage.repository';
import { StudentSubscriptionSchoolPageRepository } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.repository';
import { SchoolNewsEntity } from '@app/entity/school-news/SchoolNews.entity';
import { SubscribeSchoolPageDto } from './dto/SubscribeSchoolPageDto';
import { GetSubscribingSchoolPagesResult } from './dto/GetSubscribingSchoolPagesResult';
import { GetSubscribingPageNewsByPageIdResult } from './dto/GetSubscribingPageNewsByPageIdResult';
import { GetNewsFeedsResult } from './dto/GetNewsFeedsResult';

@Injectable()
export class StudentSubscriptionSchoolPageService {
  constructor(
    @InjectRepository(StudentSubscriptionSchoolPageEntity)
    private readonly studentSubscriptionSchoolPageEntityRepository: Repository<StudentSubscriptionSchoolPageEntity>,

    private readonly schoolPageRepository: SchoolPageRepository,

    private readonly studentSubscriptionSchoolPageRepository: StudentSubscriptionSchoolPageRepository,

    @InjectRepository(SchoolNewsEntity)
    private readonly schoolNewsEntityRepository: Repository<SchoolNewsEntity>,
  ) {}

  async subscribe(dto: SubscribeSchoolPageDto): Promise<number> {
    const schoolPage = await this.schoolPageRepository.getById(
      dto.schoolPageId,
    );
    const result =
      await this.studentSubscriptionSchoolPageEntityRepository.insert(
        dto.toEntity(schoolPage),
      );

    return result.raw.insertId;
  }

  async getSubscribingSchoolPages(studentId: number) {
    const schoolPages =
      await this.studentSubscriptionSchoolPageRepository.getSubscribingSchoolPages(
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

  async getSubscribingPageNewsByStudentIdAndPageId(
    studentId: number,
    schoolPageId: number,
  ) {
    await this.studentSubscriptionSchoolPageRepository.getSubscriptionByStudentIdAndSchoolId(
      studentId,
      schoolPageId,
    );

    const newsList = await this.schoolNewsEntityRepository.find({
      where: {
        schoolPage: {
          id: schoolPageId,
        },
      },
      order: {
        createdAt: 'desc',
      },
    });

    return newsList.map(
      (it) => new GetSubscribingPageNewsByPageIdResult(it.title, it.content),
    );
  }

  async getNewsFeeds(studentId: number) {
    const newsFeeds =
      await this.studentSubscriptionSchoolPageRepository.getNewsFeeds(
        studentId,
      );

    return newsFeeds.map((it) => new GetNewsFeedsResult(it.title, it.content));
  }
}
