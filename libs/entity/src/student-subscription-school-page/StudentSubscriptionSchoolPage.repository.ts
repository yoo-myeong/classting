import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { StudentSubscriptionSchoolPageEntity } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.entity';
import { GetSubscribingSchoolPagesQueryResult } from '@app/entity/student-subscription-school-page/dto/GetSubscribingSchoolPagesQueryResult';
import { CustomError } from '@app/common-config/error/CustomError';
import { ResponseStatus } from '@app/common-config/res/ResponseStastus';
import { SchoolNewsEntity } from '@app/entity/school-news/SchoolNews.entity';
import { plainToInstance } from 'class-transformer';
import { GetNewsFeedsQueryResult } from '@app/entity/student-subscription-school-page/dto/GetNewsFeedsQueryResult';

@Injectable()
export class StudentSubscriptionSchoolPageRepository {
  constructor(
    @InjectRepository(StudentSubscriptionSchoolPageEntity)
    private readonly studentSubscriptionSchoolPageEntityRepository: Repository<StudentSubscriptionSchoolPageEntity>,
  ) {}

  async getSubscribingSchoolPages(studentId: number) {
    const sub = await this.studentSubscriptionSchoolPageEntityRepository
      .createQueryBuilder('ss')
      .innerJoinAndSelect('ss.schoolPage', 'sp')
      .where('ss.studentId=:studentId', { studentId })
      .andWhere('ss.deletedAt is null')
      .orderBy('ss.createdAt', 'DESC')
      .getMany();

    return sub.map(
      (it) =>
        new GetSubscribingSchoolPagesQueryResult({
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
        ResponseStatus.NOT_SUBSCRIBING_PAGE,
        '구독중인 페이지가 아닙니다.',
      );

    return subscription;
  }

  async getNewsFeeds(studentId: number) {
    const newsFeeds = await this.studentSubscriptionSchoolPageEntityRepository
      .createQueryBuilder('ssp')
      .select('sn.title', 'title')
      .addSelect('sn.content', 'content')
      .withDeleted()
      .innerJoin('ssp.schoolPage', 'sp')
      .innerJoin(SchoolNewsEntity, 'sn', 'sn.school_page_id = sp.id')
      .where('ssp.studentId=:studentId', { studentId })
      .andWhere('sn.createdAt >= ssp.createdAt')
      .andWhere(
        new Brackets((qb) => {
          qb.where('ssp.deletedAt >= sn.createdAt').orWhere(
            'ssp.deletedAt is null',
          );
        }),
      )
      .orderBy('sn.createdAt', 'DESC')
      .getRawMany();

    return newsFeeds.map((it) => plainToInstance(GetNewsFeedsQueryResult, it));
  }
}
