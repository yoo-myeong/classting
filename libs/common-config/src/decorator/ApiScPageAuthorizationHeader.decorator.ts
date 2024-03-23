import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export const ApiSchoolPageAuthHeader = () =>
  applyDecorators(
    ApiHeader({
      name: 'Authorization',
      required: true,
      schema: {
        example: 'test-token',
      },
    }),
  );
