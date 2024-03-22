import { HttpExceptionFilter } from '@app/common-config/filter/api/http-exception.filter';
import { Catch, Logger, UnauthorizedException } from '@nestjs/common';
import { ResponseStatus } from '@app/common-config/res/ResponseStastus';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter extends HttpExceptionFilter {
  constructor(logger: Logger) {
    super(logger, ResponseStatus.UNAUTHORIZED);
  }
}
