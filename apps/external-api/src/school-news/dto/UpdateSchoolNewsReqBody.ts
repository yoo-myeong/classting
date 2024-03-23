import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UpdateSchoolNewsDto } from './UpdateSchoolNewsDto';

export class UpdateSchoolNewsReqBody {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  toDomain(id: number) {
    return new UpdateSchoolNewsDto({
      id,
      title: this.title,
      content: this.content,
    });
  }
}
