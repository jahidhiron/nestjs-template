import { DatabaseOptions } from '@/db/interfaces';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { NamingStrategy } from './naming-strategy.config';

export const getBaseDatabaseConfig = ({
  config,
  logger,
}: DatabaseOptions): TypeOrmModuleOptions & DataSourceOptions => {
  const app = config.app;
  const db = config.db;

  const baseConfig: TypeOrmModuleOptions & DataSourceOptions = {
    type: db.type,
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*.{ts,js}'],
    synchronize: app.isDev,
    dropSchema: app.isTest,
    migrationsRun: db.migrationsRun,
    charset: db.charset,
    bigNumberStrings: db.bigNumberStrings,
    connectTimeout: db.connectTimeout,
    namingStrategy: new NamingStrategy(),
    extra: db.extra,
  };

  if (db.url) {
    return { ...baseConfig, url: db.url };
  } else {
    const { host, port, username, password, database } = db;

    if (!host || !port || !username || !password || !database) {
      const message =
        'Missing required database configuration. Provide either DATABASE_URL or individual MySQL env variables.';
      logger.error(message);
      throw new Error(message);
    }

    return { ...baseConfig, host, port, username, password, database };
  }
};
