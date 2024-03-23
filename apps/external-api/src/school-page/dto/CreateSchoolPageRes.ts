import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSchoolPageRes {
  @Exclude() private readonly _id: number;

  constructor(id: number) {
    this._id = id;
  }

  @ApiProperty()
  @Expose()
  get id(): number {
    return this._id;
  }
}
