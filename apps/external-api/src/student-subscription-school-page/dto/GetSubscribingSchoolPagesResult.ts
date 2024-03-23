import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetSubscribingSchoolPagesResult {
  @Exclude()
  private readonly _id: number;

  @Exclude()
  private readonly _region: string;

  @Exclude()
  private readonly _schoolName: string;

  constructor(ctx: { id: number; region: string; schoolName: string }) {
    this._id = ctx.id;
    this._region = ctx.region;
    this._schoolName = ctx.schoolName;
  }

  @ApiProperty()
  @Expose()
  get id(): number {
    return this._id;
  }

  @ApiProperty()
  @Expose()
  get region(): string {
    return this._region;
  }

  @ApiProperty()
  @Expose()
  get schoolName(): string {
    return this._schoolName;
  }
}
