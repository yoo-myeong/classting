import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSchoolPage } from '@app/domain/school-page/CreateSchoolPage.domain';

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
    return CreateSchoolPage.create({
      region: this.region,
      name: this.name,
      schoolId,
    });
  }
}
