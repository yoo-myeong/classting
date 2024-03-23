import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';
import { SchoolPageDomain } from '@app/domain/school-page/SchoolPage.domain';

@Injectable()
export class SchoolPageService {
  constructor(
    @InjectRepository(SchoolPageEntity)
    private readonly scPageEntityRepository: Repository<SchoolPageEntity>,
  ) {}

  async createScPage(createSchoolPage: SchoolPageDomain) {
    await createSchoolPage.validate();
    await this.scPageEntityRepository.insert(createSchoolPage.toEntity());
  }
}
