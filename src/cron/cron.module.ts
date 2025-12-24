import { ConfigModule } from '@/config';
import { UpdateProfileService } from '@/cron/services';
import { ProjectModule } from '@/modules/projects/project.module';
import { RabbitMqModule } from '@/rabbitmq/rabitmq.module';
import { forwardRef, Module } from '@nestjs/common';

/**
 * CronModule
 *
 * Handles scheduled tasks for the application.
 * Includes services that perform periodic operations such as monitoring results.
 *
 * @category Modules
 */
@Module({
  imports: [forwardRef(() => ProjectModule), RabbitMqModule, ConfigModule],
  providers: [UpdateProfileService],
})
export class CronModule {}
