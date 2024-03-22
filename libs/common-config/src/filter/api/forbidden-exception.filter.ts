import { HttpExceptionFilter } from '@app/common-config/filter/api/http-exception.filter';
import { Catch, ForbiddenException, Logger } from '@nestjs/common';
import { ResponseStatus } from '@app/common-config/res/ResponseStastus';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter extends HttpExceptionFilter {
  constructor(logger: Logger) {
    super(logger, ResponseStatus.FORBIDDEN);
  }
}
