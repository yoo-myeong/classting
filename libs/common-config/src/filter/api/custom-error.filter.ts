import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { CustomError } from '@app/common-config/error/CustomError';
import { instanceToPlain } from 'class-transformer';
import { ResponseEntity } from '@app/common-config/res/ResponseEntity';
import { StatusCodeByResponseStatus } from '@app/common-config/res/StatusCodeByResponseStatus';

@Catch(CustomError)
export class CustomErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: CustomError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.status;

    this.logger.warn(
      `[WARN] Custom Error: ${JSON.stringify({
        name: exception.name,
        message: exception.message,
        stack: exception.stack,
        error: exception.error,
      })}`,
    );

    response
      .status(StatusCodeByResponseStatus[status])
      .json(
        instanceToPlain(ResponseEntity.failWith(status, exception.message)),
      );
  }
}
