import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSchoolPageAuthHeader } from '@app/common-config/decorator/ApiSchoolPageAuthHeader.decorator';
import { SchoolPageGuard } from '@app/common-config/guard/SchoolPage.guard';
import { ResponseData } from '@app/common-config/decorator/ResponseData.decorator';
import { SchoolNewsService } from './SchoolNews.service';
import { PublishSchoolNewsReqBody } from './dto/PublishSchoolNewsReqBody';
import { UpdateSchoolNewsReqBody } from './dto/UpdateSchoolNewsReqBody';
import { PublishSchoolNewsRes } from './dto/PublishSchoolNewsRes';

@ApiTags('학교 소식')
@Controller('schools/pages/:pageId/news')
export class SchoolNewsController {
  constructor(private readonly schoolNewsService: SchoolNewsService) {}

  @ApiOperation({
    summary: '학교 소식 작성',
  })
  @ApiSchoolPageAuthHeader()
  @ResponseData(PublishSchoolNewsRes)
  @UseGuards(SchoolPageGuard)
  @Post()
  async publish(
    @Param('pageId', ParseIntPipe) pageId: number,
    @Body() body: PublishSchoolNewsReqBody,
  ) {
    const id = await this.schoolNewsService.createSchoolNews(
      body.toDomain(pageId),
    );
    return new PublishSchoolNewsRes(id);
  }

  @ApiOperation({
    summary: '학교 소식 삭제',
  })
  @ApiSchoolPageAuthHeader()
  @UseGuards(SchoolPageGuard)
  @Delete(':newsId')
  async deleteById(
    @Param('pageId', ParseIntPipe) pageId: number,
    @Param('newsId', ParseIntPipe) newsId: number,
  ) {
    await this.schoolNewsService.deleteById(newsId);
  }

  @ApiOperation({
    summary: '학교 소식 수정',
  })
  @ApiSchoolPageAuthHeader()
  @UseGuards(SchoolPageGuard)
  @Patch(':newsId')
  async update(
    @Param('pageId', ParseIntPipe) pageId: number,
    @Param('newsId', ParseIntPipe) newsId: number,
    @Body() body: UpdateSchoolNewsReqBody,
  ) {
    await this.schoolNewsService.updateSchoolNews(body.toDomain(newsId));
  }
}
