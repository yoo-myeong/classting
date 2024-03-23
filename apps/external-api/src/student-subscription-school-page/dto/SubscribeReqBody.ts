import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubscribeSchoolPageDto } from './SubscribeSchoolPageDto';

export class SubscribeReqBody {
  @ApiProperty()
  @IsNumber()
  schoolPageId: number;

  toSubscribeSchoolPageDto(studentId: number) {
    return new SubscribeSchoolPageDto(studentId, this.schoolPageId);
  }
}
