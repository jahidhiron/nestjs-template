import { ConfigModule, ConfigService } from '@/config';
import { ProjectModule } from '@/modules/projects/project.module';
import { ServiceNames } from '@/rabbitmq/constants';
import { UpdateProfileConsumerController } from '@/rabbitmq/consumers';
import { UpdateProfileProducerService } from '@/rabbitmq/producers';
import { RealtimeModule } from '@/realtime/realtime.module';
import { forwardRef, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    forwardRef(() => ProjectModule),
    // CommonModule,
    ConfigModule,
    RealtimeModule,
    ClientsModule.registerAsync([
      {
        name: ServiceNames.NEST_TEMPLATE_SYNC,
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
  providers: [UpdateProfileProducerService],
  controllers: [UpdateProfileConsumerController],
  exports: [ClientsModule, UpdateProfileProducerService],
})
export class RabbitMqModule {}
