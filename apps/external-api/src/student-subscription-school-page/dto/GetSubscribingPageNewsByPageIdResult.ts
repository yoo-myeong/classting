import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetSubscribingPageNewsByPageIdResult {
  @Exclude() private readonly _title: string;

  @Exclude() private readonly _content: string;

  constructor(title: string, content: string) {
    this._title = title;
    this._content = content;
  }

  @ApiProperty()
  @Expose()
  get title(): string {
    return this._title;
  }

  @ApiProperty()
  @Expose()
  get content(): string {
    return this._content;
  }
}
