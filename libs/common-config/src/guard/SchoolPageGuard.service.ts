import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';

@Injectable()
export class SchoolPageGuard implements CanActivate {
  constructor(
    @InjectRepository(SchoolPageEntity)
    private readonly schoolPageEntityRepository: Repository<SchoolPageEntity>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const schoolPageId = req.params.pageId;

    const token = req.headers.Authorization ?? req.headers.authorization;
    if (!token) return false;

    req.user = {
      id: 1,
    };

    const schoolPage = await this.schoolPageEntityRepository.findOneBy({
      id: schoolPageId,
    });

    return schoolPage.schoolId === req.user.id;
  }
}
