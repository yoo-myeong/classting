import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolNewsEntity } from '@app/entity/school-news/SchoolNews.entity';
import { SchoolPageRepository } from '@app/entity/school-page/SchoolPage.repository';
import { SchoolNewsDomain } from '@app/domain/school-news/SchoolNews.domain';

@Injectable()
export class SchoolNewsService {
  constructor(
    @InjectRepository(SchoolNewsEntity)
    private readonly scNewEntityRepository: Repository<SchoolNewsEntity>,

    private readonly scPageRepository: SchoolPageRepository,
  ) {}

  async createScNew(schoolNews: SchoolNewsDomain) {
    await schoolNews.validate();
    const scPage = await this.scPageRepository.getById(schoolNews.schoolPageId);
    await this.scNewEntityRepository.insert(schoolNews.toEntity(scPage));
  }
}
