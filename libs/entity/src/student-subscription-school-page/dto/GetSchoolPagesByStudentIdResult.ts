export class GetSchoolPagesByStudentIdResult {
  public readonly id: number;

  public readonly region: string;

  public readonly schoolName: string;

  constructor(ctx: { id: number; region: string; schoolName: string }) {
    this.id = ctx.id;
    this.region = ctx.region;
    this.schoolName = ctx.schoolName;
  }
}
