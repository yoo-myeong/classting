import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { instanceToPlain } from 'class-transformer';
import { ResponseEntity } from '@app/common-config/res/ResponseEntity';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: Logger,
  ) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    this.logger.error(
      `[ERROR] ${JSON.stringify({
        name: exception.name,
        message: exception.message,
        stack: exception.stack,
      })}`,
    );

    const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = instanceToPlain(ResponseEntity.fail());

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
