import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { UpdateSchoolNewsDto } from './UpdateSchoolNewsDto';

export class UpdateSchoolNewsReqBody {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  content?: string;

  toDomain(id: number) {
    return new UpdateSchoolNewsDto({
      id,
      title: this.title,
      content: this.content,
    });
  }
}
