import { ResponseStatus } from '@app/common-config/res/ResponseStastus';

export const StatusCodeByResponseStatus: { [key in ResponseStatus]: number } = {
  OK: 200,
  BAD_PARAMETER: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  NOT_SUBSCRIBING_PAGE: 400,
};
