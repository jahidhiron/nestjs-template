import { AppConfigService } from '@/config/app';
import appConfig from '@/config/app/app.config';
import { ConfigService } from '@/config/config.service';
import { DbConfigService } from '@/config/db';
import dbConfig from '@/config/db/db.config';
import { I18nLoader } from '@/config/i18n';
import { AppLogger, createWinstonLoggerConfig } from '@/config/logger';
import { rabbitmqConfig, RabbitmqConfigService } from '@/config/rabbitmq';
import { SwaggerConfigService } from '@/config/swagger';
import swaggerConfig from '@/config/swagger/swagger.config';
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { CookieResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, swaggerConfig, dbConfig, rabbitmqConfig],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nLoader,
      loaderOptions: {},
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        HeaderResolver,
        { use: CookieResolver, options: ['i18n-lang'] },
      ],
    }),

    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: createWinstonLoggerConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [
    AppConfigService,
    ConfigService,
    AppLogger,
    SwaggerConfigService,
    DbConfigService,
    RabbitmqConfigService,
  ],
  exports: [ConfigService, AppLogger],
})
export class ConfigModule {}
