import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { instanceToPlain } from 'class-transformer';
import { ResponseEntity } from '@app/common-config/res/ResponseEntity';
import { ResponseStatus } from '@app/common-config/res/ResponseStastus';

@Catch(BadRequestException)
export class BadParameterFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    const responseBody = exception.getResponse() as Record<string, string>;
    const isValidationError = responseBody instanceof ValidationError;

    response.status(status).json(
      instanceToPlain(
        ResponseEntity.failWith(
          ResponseStatus.BAD_PARAMETER,
          '요청 값에 문제가 있습니다.',
          isValidationError
            ? {
                target: responseBody.target,
                property: responseBody.property,
                constraints: Object.entries(responseBody.constraints).map(
                  (obj) => ({
                    type: obj[0],
                    message: obj[1],
                  }),
                ),
              }
            : responseBody.message,
        ),
      ),
    );
  }
}
