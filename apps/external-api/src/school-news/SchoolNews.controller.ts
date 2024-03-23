import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSchoolPageAuthHeader } from '@app/common-config/decorator/ApiScPageAuthorizationHeader.decorator';
import { SchoolPageGuard } from '@app/common-config/guard/SchoolPageGuard.service';
import { SchoolNewsService } from './SchoolNews.service';
import { PublishSchoolNewsReqBody } from './dto/PublishSchoolNewsReqBody';

@ApiTags('학교 소식')
@Controller('schools/pages/:pageId/news')
export class SchoolNewsController {
  constructor(private readonly schoolNewsService: SchoolNewsService) {}

  @ApiOperation({
    summary: '학교 소식 작성',
  })
  @ApiSchoolPageAuthHeader()
  @UseGuards(SchoolPageGuard)
  @Post()
  async publish(
    @Param('pageId', ParseIntPipe) pageId: number,
    @Body() body: PublishSchoolNewsReqBody,
  ) {
    await this.schoolNewsService.createScNew(body.toDomain(pageId));
  }
}
