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
    private readonly schoolNewsEntityRepository: Repository<SchoolNewsEntity>,

    private readonly schoolPageRepository: SchoolPageRepository,
  ) {}

  async createScNew(schoolNews: SchoolNewsDomain) {
    await schoolNews.validate();
    const schoolPage = await this.schoolPageRepository.getById(
      schoolNews.schoolPageId,
    );
    await this.schoolNewsEntityRepository.insert(
      schoolNews.toEntity(schoolPage),
    );
  }

  async deleteById(id: number) {
    await this.schoolNewsEntityRepository.delete({
      id,
    });
  }
}
