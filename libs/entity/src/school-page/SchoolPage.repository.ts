import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomError } from '@app/common-config/error/CustomError';
import { ResponseStatus } from '@app/common-config/res/ResponseStastus';
import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';

@Injectable()
export class SchoolPageRepository {
  constructor(
    @InjectRepository(SchoolPageEntity)
    private readonly schoolPageEntityRepository: Repository<SchoolPageEntity>,
  ) {}

  async getById(id: number) {
    const schoolPage = await this.schoolPageEntityRepository.findOneBy({ id });

    if (!schoolPage)
      throw new CustomError(
        ResponseStatus.NOT_FOUND,
        '존재하지 않는 페이지입니다',
      );

    return schoolPage;
  }
}
