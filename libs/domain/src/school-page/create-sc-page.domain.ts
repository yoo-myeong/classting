import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { DomainValidator } from '@app/domain/util/DomainValidator';
import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';

export class CreateSchoolPage {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  private _region: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  private _name: string;

  @IsNumber()
  @IsPositive()
  private _schoolId: number;

  async validate() {
    await DomainValidator.validate(this);
  }

  static create(ctx: { region: string; name: string; schoolId: number }) {
    const inst = new CreateSchoolPage();
    inst._region = ctx.region;
    inst._name = ctx.name;
    inst._schoolId = ctx.schoolId;

    return inst;
  }

  toEntity() {
    const entity = new SchoolPageEntity();
    entity.region = this._region;
    entity.name = this._name;
    entity.schoolId = this._schoolId;

    return entity;
  }
}
