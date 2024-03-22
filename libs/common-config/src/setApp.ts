/* eslint-disable max-lines-per-function */

import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NodeEnv } from '@app/common-config/NodeEnv';
import { AsyncTracer } from '@app/common-config/AsyncTracer';
import { v4 as uuidV4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from '@app/common-config/logger/CustomLogger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getConfiguration } from '@app/common-config/getConfiguration';

export class App {
  private _app: INestApplication;

  private _name: string;

  static create(ctx: {
    app: INestApplication;
    name: string;
    nodeEnv: NodeEnv;
  }) {
    const { app, name, nodeEnv } = ctx;
    const inst = new App();
    inst._app = app;
    inst._name = name;

    inst.setSwagger();
    inst.setMiddleware(nodeEnv);

    return inst;
  }

  private setSwagger() {
    const config = new DocumentBuilder()
      .setTitle(`${this._name} API Docs`)
      .setDescription('classting')
      .setVersion('1.0')
      .addServer(getConfiguration().EXTERNAL_API_URL)
      .build();
    const document = SwaggerModule.createDocument(this._app, config);
    SwaggerModule.setup('docs', this._app, document, {
      swaggerOptions: {
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }

  private setMiddleware(nodeEnv: NodeEnv) {
    this._app.use((req: Request, res: Response, next: NextFunction) =>
      AsyncTracer.scope(uuidV4(), next),
    );

    this._app.useLogger(new CustomLogger(nodeEnv, this._name));
    const logger = this._app.get(Logger);

    this._app.use((req: Request, res: Response, next: NextFunction) => {
      logger.log(
        `[REQUEST] ${JSON.stringify({
          method: req.method,
          url: req.url,
          headers: req.headers,
          body: req.body,
        })}`,
      );

      let responseBody = {};
      const originalSend = res.send;
      res.send = (...args) => {
        responseBody = args[0];
        return originalSend.apply(res, args);
      };

      res.on('finish', () => {
        logger.log(
          `[RESPONSE] ${JSON.stringify({
            statusCode: res.statusCode,
            headers: res.getHeaders(),
            body: responseBody,
          })}`,
        );
      });

      next();
    });

    this._app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        disableErrorMessages: nodeEnv === NodeEnv.LIVE,
      }),
    );
  }

  async start(port: number) {
    const logger = this._app.get(Logger);

    await this._app.listen(port, () => logger.log(`server started on ${port}`));
  }

  get app() {
    return this._app;
  }
}
