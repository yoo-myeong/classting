export class UpdateNewDto {
  private readonly _id: number;

  private readonly _title?: string;

  private readonly _content?: string;

  constructor(ctx: { id: number; title?: string; content?: string }) {
    this._id = ctx.id;
    this._title = ctx.title;
    this._content = ctx.content;
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get content() {
    return this._content;
  }
}
