import { timestampWithTimezone } from '@/common/utils';
import { AppLogger } from '@/config/logger';
import { UpdateProfileDto } from '@/modules/projects/dtos';
import { ProfileStatus } from '@/modules/projects/enums';
import { ProjectService } from '@/modules/projects/project.service';
import { eventName } from '@/rabbitmq/constants';
import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Channel, ConsumeMessage } from 'amqplib';

@Controller()
export class UpdateProfileConsumerController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly logger: AppLogger,
  ) {}

  /**
   * Consumes and processes profile-update jobs from RabbitMQ.
   *
   * **Flow**
   * 1. Validate payload and ID
   * 2. Attempt to move profile → `queued` → `processing`
   * 3. Perform update (increment version, mark completed)
   * 4. Ack on success
   * 5. On error:
   *    - Mark as retryable (`nextRunAt +5m`)
   *    - `nack` to DLX
   *
   * @param profile Payload: `{ id, version, ... }`
   * @param context RabbitMQ delivery context
   */
  @MessagePattern(eventName.profile.update)
  async processProfileUpdates(
    @Payload() profile: UpdateProfileDto,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef() as Channel;
    const msg = context.getMessage() as ConsumeMessage;

    const id = Number(profile.id);
    const currentVersion = Number.isFinite(profile.version) ? profile.version! : 0;
    const nextVersion = currentVersion + 1;

    try {
      // Step 1: Ensure job is still valid to process
      const moved = await this.projectService.updateProfile(
        { id, queueStatus: ProfileStatus.Queued },
        { queueStatus: ProfileStatus.Processing },
      );

      if (!moved) {
        this.logger.warn(`Skip id=${id}: not queued anymore`);
        channel.ack(msg);
        return;
      }

      // Step 2: Apply update
      const updatePatch: UpdateProfileDto = {
        queueStatus: ProfileStatus.Idle,
        lastProcessedAt: timestampWithTimezone(),
        version: nextVersion,
        nextRunAt: null,
      };

      await this.projectService.updateProfile(
        { id, queueStatus: ProfileStatus.Processing },
        updatePatch,
      );

      this.logger.log(`Profile updated successfully (id=${id}, version=${nextVersion})`);
      channel.ack(msg);
    } catch (err: unknown) {
      // Step 3: Failure — schedule retry
      const backoff = 5; // minutes
      const runAfter = new Date(Date.now() + backoff * 60_000);

      try {
        await this.projectService.updateProfile(
          { id, queueStatus: ProfileStatus.Processing },
          {
            queueStatus: ProfileStatus.Idle,
            nextRunAt: timestampWithTimezone(runAfter),
          },
        );
      } catch (markFailErr: unknown) {
        this.logger.error(
          `Failed to mark profile as failed (id=${id}).`,
          (markFailErr as Error)?.message ?? String(markFailErr),
        );
      }

      // Step 4: Log + DLX
      const error = err as Error;
      this.logger.error(`Profile update job failed (id=${id}).`, error.stack ?? error.message);

      channel.nack(msg, false, false);
    }
  }
}
