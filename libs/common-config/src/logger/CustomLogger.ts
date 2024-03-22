import winston from 'winston';
import { getWinstonTransports } from '@app/common-config/logger/getWinstonTransports';
import { LoggerService } from '@nestjs/common';
import { AsyncTracer } from '@app/common-config/AsyncTracer';
import { NodeEnv } from '@app/common-config/NodeEnv';

export class CustomLogger implements LoggerService {
  private readonly logger: winston.Logger;

  constructor(nodeEnv: NodeEnv, moduleName: string) {
    this.logger = winston.createLogger({
      transports: getWinstonTransports(nodeEnv, moduleName),
    });
  }

  private getMetaData() {
    return {
      traceId: AsyncTracer.getTraceId(),
    };
  }

  log(message: string) {
    this.logger.info(message, this.getMetaData());
  }

  warn(message: string) {
    this.logger.warn(message, this.getMetaData());
  }

  error(message: string) {
    this.logger.error(message, this.getMetaData());
  }
}
