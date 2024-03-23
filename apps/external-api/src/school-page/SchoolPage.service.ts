import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';
import { CreateSchoolPage } from '@app/domain/school-page/CreateSchoolPage.domain';

@Injectable()
export class SchoolPageService {
  constructor(
    @InjectRepository(SchoolPageEntity)
    private readonly scPageEntityRepository: Repository<SchoolPageEntity>,
  ) {}

  async createScPage(createSchoolPage: CreateSchoolPage) {
    await createSchoolPage.validate();
    await this.scPageEntityRepository.insert(createSchoolPage.toEntity());
  }
}
