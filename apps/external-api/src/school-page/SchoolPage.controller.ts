import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ApiSchoolAuthHeader } from '@app/common-config/decorator/ApiSchoolAuthHeader.decorator';
import { SchoolUserGuard } from '@app/common-config/guard/SchoolUser.guard';
import { SchoolPageService } from './SchoolPage.service';
import { CreateSchoolPageReqBody } from './dto/CreateSchoolPageReqBody';

@ApiTags('school page')
@Controller('school/page')
export class SchoolPageController {
  constructor(private readonly schoolPageService: SchoolPageService) {}

  @ApiOperation({
    summary: 'sc 페이지 등록',
  })
  @ApiSchoolAuthHeader()
  @UseGuards(SchoolUserGuard)
  @Post()
  async createScPage(
    @Req() req: Request,
    @Body() body: CreateSchoolPageReqBody,
  ) {
    const userId: number = req['user'].id;
    await this.schoolPageService.createScPage(body.toDomain(userId));
  }
}