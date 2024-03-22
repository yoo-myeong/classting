import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseStatus } from '@app/common-config/res/ResponseStastus';
import { NodeEnv } from '@app/common-config/NodeEnv';
import { AsyncTracer } from '@app/common-config/AsyncTracer';

export class ResponseEntity {
  @Exclude()
  private readonly _statusCode: string;

  @Exclude()
  private readonly _message: string;

  @Exclude()
  private readonly _data: string | Record<string, unknown>;

  private constructor(
    status: ResponseStatus,
    message: string,
    data: string | Record<string, unknown>,
  ) {
    this._statusCode = ResponseStatus[status];
    this._message = message;
    this._data = data;
  }

  static successWith(
    data: string | Record<string, unknown> = '',
  ): ResponseEntity {
    return new ResponseEntity(ResponseStatus.OK, '', data);
  }

  static fail(): ResponseEntity {
    const defaultErrorMessage = '서버 에러가 발생했습니다';
    const traceIdMessage =
      process.env.NODE_ENV !== NodeEnv.LIVE
        ? `(trace-id=${AsyncTracer.getTraceId()})`
        : '';

    const messages = [defaultErrorMessage, traceIdMessage];

    return new ResponseEntity(
      ResponseStatus.SERVER_ERROR,
      messages.toString(),
      '',
    );
  }

  static failWith(
    status: ResponseStatus,
    message: string = '',
    data: string | Record<string, unknown> = '',
  ): ResponseEntity {
    return new ResponseEntity(status, message, data);
  }

  @ApiProperty()
  @Expose()
  get statusCode(): string {
    return this._statusCode;
  }

  @ApiProperty()
  @Expose()
  get message(): string {
    return this._message;
  }

  @ApiProperty()
  @Expose()
  get data() {
    return this._data;
  }
}
