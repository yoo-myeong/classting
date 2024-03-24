import { NestFactory } from '@nestjs/core';
import { App } from '@app/common-config/setApp';
import { getNodeEnv } from '@app/common-config/NodeEnv';
import { Configuration } from '@app/common-config/config/Configuration';
import { ExternalApiModule } from './external-api.module';

async function bootstrap() {
  await App.create({
    app: await NestFactory.create(ExternalApiModule),
    name: 'EXTERNAL-API',
    nodeEnv: getNodeEnv(process.env.NODE_ENV),
  }).start(+process.env[Configuration.EXTERNAL_API_PORT]);
}
bootstrap();
