import { HttpExceptionFilter } from '@app/common-config/filter/api/http-exception.filter';
import { Catch, Logger, NotFoundException } from '@nestjs/common';
import { ResponseStatus } from '@app/common-config/res/ResponseStastus';

@Catch(NotFoundException)
export class NotFoundExceptionsFilter extends HttpExceptionFilter {
  constructor(logger: Logger) {
    super(logger, ResponseStatus.NOT_FOUND);
  }
}
