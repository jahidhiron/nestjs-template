import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  type: (process.env.TYPE as 'mysql' | 'mariadb') || 'mysql',
  url: process.env.DATABASE_URL || undefined,
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306,
  username: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'app_db',
  charset: process.env.CHAR_SET || 'utf8mb4',
  bigNumberStrings: process.env.DB_BIG_NUMBER_STRINGS === 'true',
  connectTimeout: 10000,
  extra: {
    connectionLimit: process.env.NODE_ENV === 'production' ? 20 : 5,
    queueLimit: 0,
    waitForConnections: true,
  },
  migrationsRun: process.env.MIGRATIONS_RUN === 'true',
  retryAttempts: process.env.DB_RETRY_ATTEMPTS ? parseInt(process.env.DB_RETRY_ATTEMPTS, 10) : 5,
  retryDelay: process.env.DB_RETRY_DELAY ? parseInt(process.env.DB_RETRY_DELAY, 10) : 3000,
}));
