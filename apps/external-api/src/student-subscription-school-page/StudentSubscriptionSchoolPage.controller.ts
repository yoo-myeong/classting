import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiStudentAuthHeader } from '@app/common-config/decorator/ApiStudentAuthHeader.decorator';
import { StudentUserGuard } from '@app/common-config/guard/StudentUser.guard';
import { ResponseData } from '@app/common-config/decorator/ResponseData.decorator';
import { StudentSubscriptionSchoolPageService } from './StudentSubscriptionSchoolPage.service';
import { SubscribeReqBody } from './dto/SubscribeReqBody';
import { GetSubscribingSchoolPagesResult } from './dto/GetSubscribingSchoolPagesResult';
import { GetSubscribingPageNewsByPageIdResult } from './dto/GetSubscribingPageNewsByPageIdResult';
import { SubscribeRes } from './dto/SubscribeRes';

@ApiTags('학생 학교페이지 구독')
@Controller('students')
export class StudentSubscriptionSchoolPageController {
  constructor(
    private readonly studentSubscriptionSchoolPageService: StudentSubscriptionSchoolPageService,
  ) {}

  @ApiOperation({
    summary: '학생의 학교페이지 구독 등록',
  })
  @ApiStudentAuthHeader()
  @ResponseData(SubscribeRes)
  @UseGuards(StudentUserGuard)
  @Post('subscriptions')
  async subscribe(@Req() req: Request, @Body() body: SubscribeReqBody) {
    const userId = req['user'].id;
    const id = await this.studentSubscriptionSchoolPageService.subscribe(
      body.toSubscribeSchoolPageDto(userId),
    );

    return new SubscribeRes(id);
  }

  @ApiOperation({
    summary: '학생의 구독중인 학교페이지 목록 조회',
  })
  @ApiStudentAuthHeader()
  @ResponseData(GetSubscribingSchoolPagesResult)
  @UseGuards(StudentUserGuard)
  @Get('subscriptions/pages')
  async getAllSubscribingPage(@Req() req: Request) {
    const userId = req['user'].id;
    return this.studentSubscriptionSchoolPageService.getSubscribingSchoolPages(
      userId,
    );
  }

  @ApiOperation({
    summary: '학생의 학교페이지 구독 취소',
  })
  @ApiStudentAuthHeader()
  @UseGuards(StudentUserGuard)
  @Delete('subscriptions/pages/:pageId')
  async unsubscribe(@Req() req: Request, @Param('pageId') pageId: number) {
    const userId = req['user'].id;
    return this.studentSubscriptionSchoolPageService.unsubscribe(
      userId,
      pageId,
    );
  }

  @ApiOperation({
    summary: '학생의 구독중인 학교페이지 소식 최신순 조회',
  })
  @ApiStudentAuthHeader()
  @ResponseData(GetSubscribingPageNewsByPageIdResult)
  @UseGuards(StudentUserGuard)
  @Get('subscriptions/pages/:pageId/news')
  async getSubscribingPageNewsList(
    @Req() req: Request,
    @Param('pageId') pageId: number,
  ) {
    const userId = req['user'].id;
    return this.studentSubscriptionSchoolPageService.getSubscribingPageNewsByStudentIdAndPageId(
      userId,
      pageId,
    );
  }

  @ApiOperation({
    summary: '학생의 뉴스피드 조회',
  })
  @ApiStudentAuthHeader()
  @ResponseData(GetSubscribingPageNewsByPageIdResult)
  @UseGuards(StudentUserGuard)
  @Get('news-feed')
  async getNewsFeeds(@Req() req: Request) {
    const userId = req['user'].id;
    return this.studentSubscriptionSchoolPageService.getNewsFeeds(userId);
  }
}
