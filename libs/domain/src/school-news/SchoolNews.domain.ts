import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DomainValidator } from '@app/domain/util/DomainValidator';
import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';
import { SchoolNewsEntity } from '@app/entity/school-news/SchoolNews.entity';

export class SchoolNewsDomain {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  private _schoolPageId: number;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty()
  private _title: string;

  @IsString()
  @MinLength(20)
  @IsNotEmpty()
  private _content: string;

  static create(ctx: { schoolPageId: number; title: string; content: string }) {
    const inst = new SchoolNewsDomain();
    inst._schoolPageId = ctx.schoolPageId;
    inst._title = ctx.title;
    inst._content = ctx.content;

    return inst;
  }

  async validate() {
    await DomainValidator.validate(this);
  }

  get schoolPageId() {
    return this._schoolPageId;
  }

  toEntity(schoolPage: SchoolPageEntity) {
    const entity = new SchoolNewsEntity();
    entity.title = this._title;
    entity.content = this._content;
    entity.schoolPage = schoolPage;

    return entity;
  }
}
