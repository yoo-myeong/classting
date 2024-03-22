import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { getNodeEnv, NodeEnv } from '@app/common-config/NodeEnv';
import { getConfiguration } from '@app/common-config/getConfiguration';
import { getEntities } from '@app/entity/getEntities';

export function getMySQLTypeOrmModule() {
  const nodeEnv = getNodeEnv(process.env.NODE_ENV);

  return TypeOrmModule.forRoot({
    type: 'mysql',
    host: getConfiguration().MYSQL_HOST,
    port: +getConfiguration().MYSQL_PORT,
    username: getConfiguration().MYSQL_USERNAME,
    password: getConfiguration().MYSQL_PASSWORD,
    database: getConfiguration().MYSQL_DATABASE,
    entities: getEntities(),
    autoLoadEntities: true,
    synchronize: true,
    logging: nodeEnv === NodeEnv.LOCAL,
    namingStrategy: new SnakeNamingStrategy(),
    extra: {
      decimalNumbers: true,
    },
  });
}
