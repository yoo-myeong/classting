import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { ResponseEntity } from '@app/common-config/res/ResponseEntity';
import { ResponseStatus } from '@app/common-config/res/ResponseStastus';

export abstract class HttpExceptionFilter implements ExceptionFilter {
  protected constructor(
    private readonly logger: Logger,
    private readonly responseStatus: ResponseStatus,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    this.logger.warn(
      `[WARN] http exception: ${JSON.stringify({
        name: exception.name,
        message: exception.message,
        stack: exception.stack,
      })}`,
    );

    response
      .status(status)
      .json(
        instanceToPlain(
          ResponseEntity.failWith(this.responseStatus, exception.message),
        ),
      );
  }
}
