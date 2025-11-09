import { AppLogger } from '@/config/logger';
import { RabbitmqConfigService } from '@/config/rabbitmq';
import { INestApplication } from '@nestjs/common';
import { RmqOptions, Transport } from '@nestjs/microservices';

/**
 * Sets up RabbitMQ connection for the NestJS application.
 *
 * @param app - The NestJS application instance.
 * @param rabbitmq - Configuration service for RabbitMQ.
 * @param logger - Custom logger for logging the setup process.
 */
export async function setupRabbitmq(
  app: INestApplication,
  rabbitmq: RabbitmqConfigService,
  logger: AppLogger,
): Promise<void> {
  try {
    const rmqOptions: RmqOptions = {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmq.rabbitmqUri],
        queue: rabbitmq.rabbitmqQueue,
        queueOptions: { durable: true },
        noAck: false,
        prefetchCount: 10,
      },
    };

    logger.log(`RabbitMQ queue configured: ${rabbitmq.rabbitmqQueue}`, 'RabbitMQ');
    app.connectMicroservice<RmqOptions>(rmqOptions);

    // Start all microservices
    await app.startAllMicroservices();
  } catch (error: unknown) {
    const stack = error instanceof Error ? error.stack : undefined;
    logger.error('Error setting up RabbitMQ connection', stack);
  }
}
