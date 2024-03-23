import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiStudentAuthHeader } from '@app/common-config/decorator/ApiStudentAuthHeader.decorator';
import { StudentUserGuard } from '@app/common-config/guard/StudentUser.guard';
import { StudentSubscriptionSchoolPageService } from './StudentSubscriptionSchoolPage.service';
import { SubscribeReqBody } from './dto/SubscribeReqBody';

@ApiTags('학생 학교페이지 구독')
@Controller('students/subscriptions')
export class StudentSubscriptionSchoolPageController {
  constructor(
    private readonly studentSubscriptionSchoolPageService: StudentSubscriptionSchoolPageService,
  ) {}

  @ApiOperation({
    summary: '학생의 학교페이지 구독 등록',
  })
  @ApiStudentAuthHeader()
  @UseGuards(StudentUserGuard)
  @Post()
  async subscribe(@Req() req: Request, @Body() body: SubscribeReqBody) {
    const userId = req['user'].id;
    await this.studentSubscriptionSchoolPageService.subscribe(
      body.toSubscribeSchoolPageDto(userId),
    );
  }

  @ApiOperation({
    summary: '학생의 구독중인 학교페이지 목록 조회',
  })
  @ApiStudentAuthHeader()
  @UseGuards(StudentUserGuard)
  @Get('pages')
  async getAllPg(@Req() req: Request) {
    const userId = req['user'].id;
    return this.studentSubscriptionSchoolPageService.getSubscribingSchoolPages(
      userId,
    );
  }
}
