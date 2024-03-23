import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export const ApiSchoolAuthHeader = () =>
  applyDecorators(
    ApiHeader({
      name: 'X-Authorization',
      required: true,
      schema: {
        example: 'test-token',
      },
    }),
  );
