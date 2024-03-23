import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SchoolPageDomain } from '@app/domain/school-page/SchoolPage.domain';

export class CreateSchoolPageReqBody {
  @ApiProperty()
  @IsString()
  region: string;

  @ApiProperty({
    description: 'sc명',
    required: true,
  })
  @IsString()
  name: string;

  toDomain(schoolId: number) {
    return SchoolPageDomain.create({
      region: this.region,
      name: this.name,
      schoolId,
    });
  }
}
