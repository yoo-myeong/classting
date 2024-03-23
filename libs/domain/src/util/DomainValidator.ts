import { validate as classValidate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export class DomainValidator {
  static async validate(inst: object) {
    const validated = await classValidate(inst);

    if (validated.length) {
      const message = validated
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((it) => Object.values(it.constraints!)[0])
        .join(', ');

      throw new BadRequestException(message);
    }
  }
}
