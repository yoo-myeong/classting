import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { getEntities } from '@app/entity/getEntities';

export const getTestMySQLTypeOrmModule = () => {
  return TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3310,
    username: 'root',
    password: 'test',
    database: 'test',
    entities: getEntities(),
    autoLoadEntities: true,
    synchronize: true,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
    extra: {
      decimalNumbers: true,
    },
  });
};
