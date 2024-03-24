import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CustomError } from '@app/common-config/error/CustomError';
import { ResponseStatus } from '@app/common-config/res/ResponseStastus';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolNewsEntity } from '@app/entity/school-news/SchoolNews.entity';
import { SchoolNewsDomain } from '@app/domain/school-news/SchoolNews.domain';

@Injectable()
export class SchoolNewsRepository {
  constructor(
    @InjectRepository(SchoolNewsEntity)
    private readonly schoolNewsEntityRepository: Repository<SchoolNewsEntity>,
  ) {}

  async getSchoolNewsById(id: number) {
    const news = await this.schoolNewsEntityRepository
      .createQueryBuilder('sn')
      .innerJoinAndSelect('sn.schoolPage', 'sp')
      .where('sn.id = :id', { id })
      .getOne();

    if (!news)
      throw new CustomError(
        ResponseStatus.NOT_FOUND,
        '존재하지 않는 소식입니다.',
      );

    return SchoolNewsDomain.create({
      title: news.title,
      content: news.content,
      schoolPageId: news.schoolPage.id,
    });
  }
}
