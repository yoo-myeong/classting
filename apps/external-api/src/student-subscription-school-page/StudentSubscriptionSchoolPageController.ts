import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
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
    summary: '학생 학교페이지 구독 등록',
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
}
