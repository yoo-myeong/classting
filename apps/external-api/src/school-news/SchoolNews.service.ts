import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolNewsEntity } from '@app/entity/school-news/SchoolNews.entity';
import { SchoolPageRepository } from '@app/entity/school-page/SchoolPage.repository';
import { SchoolNewsDomain } from '@app/domain/school-news/SchoolNews.domain';
import { SchoolNewsRepository } from '@app/entity/school-news/SchoolNews.repository';
import { UpdateSchoolNewsDto } from './dto/UpdateSchoolNewsDto';

@Injectable()
export class SchoolNewsService {
  constructor(
    @InjectRepository(SchoolNewsEntity)
    private readonly schoolNewsEntityRepository: Repository<SchoolNewsEntity>,

    private readonly schoolPageRepository: SchoolPageRepository,

    private readonly schoolNewsRepository: SchoolNewsRepository,
  ) {}

  async createSchoolNews(schoolNews: SchoolNewsDomain) {
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

  async updateSchoolNews(dto: UpdateSchoolNewsDto) {
    const newId = dto.id;
    const schoolNews = await this.schoolNewsRepository.getPublishNewById(newId);
    schoolNews.update({
      title: dto.title,
      content: dto.content,
    });
    await schoolNews.validate();

    await this.schoolNewsEntityRepository.update(
      { id: newId },
      schoolNews.getUpdateContext(),
    );
  }
}
