import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';
import { SchoolPageDomain } from '@app/domain/school-page/SchoolPage.domain';

@Injectable()
export class SchoolPageService {
  constructor(
    @InjectRepository(SchoolPageEntity)
    private readonly schoolPageEntityRepository: Repository<SchoolPageEntity>,
  ) {}

  async createSchoolPage(createSchoolPage: SchoolPageDomain) {
    await createSchoolPage.validate();
    await this.schoolPageEntityRepository.insert(createSchoolPage.toEntity());
  }
}
