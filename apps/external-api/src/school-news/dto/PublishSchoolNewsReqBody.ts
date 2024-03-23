import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { SchoolNewsDomain } from '@app/domain/school-news/SchoolNews.domain';

export class PublishSchoolNewsReqBody {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  toDomain(schoolPageId: number) {
    return SchoolNewsDomain.create({
      title: this.title,
      content: this.content,
      schoolPageId,
    });
  }
}
