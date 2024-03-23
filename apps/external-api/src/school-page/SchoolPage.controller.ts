import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ApiSchoolAuthHeader } from '@app/common-config/decorator/ApiSchoolAuthHeader.decorator';
import { SchoolUserGuard } from '@app/common-config/guard/SchoolUser.guard';
import { ResponseData } from '@app/common-config/decorator/ResponseData.decorator';
import { SchoolPageService } from './SchoolPage.service';
import { CreateSchoolPageReqBody } from './dto/CreateSchoolPageReqBody';
import { CreateSchoolPageRes } from './dto/CreateSchoolPageRes';

@ApiTags('학교 페이지')
@Controller('schools/pages')
export class SchoolPageController {
  constructor(private readonly schoolPageService: SchoolPageService) {}

  @ApiOperation({
    summary: '학교 페이지 등록',
  })
  @ApiSchoolAuthHeader()
  @ResponseData(CreateSchoolPageRes)
  @UseGuards(SchoolUserGuard)
  @Post()
  async createSchoolPage(
    @Req() req: Request,
    @Body() body: CreateSchoolPageReqBody,
  ) {
    const userId: number = req['user'].id;
    const id = await this.schoolPageService.createSchoolPage(
      body.toDomain(userId),
    );
    return new CreateSchoolPageRes(id);
  }
}
