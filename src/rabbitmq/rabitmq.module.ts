import { ConfigModule, ConfigService } from '@/config';
import { ServiceNames } from '@/rabbitmq/constants';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: ServiceNames.UPSELL_STATS_SYNC,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.rabbitmq.rabbitmqUri],
            queue: configService.rabbitmq.rabbitmqQueue,
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [ClientsModule],
})
export class RabbitMqModule {}
