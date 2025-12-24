import { AppLogger } from '@/config/logger';
import { UpdateProfileDto } from '@/modules/projects/dtos';
import { eventName, ServiceNames } from '@/rabbitmq/constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class UpdateProfileProducerService {
  private connectOnce?: Promise<void>;

  constructor(
    @Inject(ServiceNames.NEST_TEMPLATE_SYNC) private readonly client: ClientProxy,
    private readonly logger: AppLogger,
  ) {}

  /**
   * Ensures the RMQ client is connected.
   * - Lazy initialized
   * - Cached for subsequent calls
   * - Resets cache on failure
   */
  private async ensureConnected(): Promise<void> {
    this.connectOnce ??= this.client.connect().catch((err) => {
      this.connectOnce = undefined;
      throw err;
    });
    return this.connectOnce;
  }

  /**
   * Publishes a profile update job to RabbitMQ.
   *
   * **Behavior**
   * - Validates ID
   * - Ensures RMQ connection
   * - Emits event with a 2s timeout
   * - Logs failures but does not throw
   *
   * @param profile Payload containing `id` and `version`
   * @returns {Promise<boolean>} `true` if queued successfully, otherwise `false`
   */
  async updateProfileJob(profile: UpdateProfileDto): Promise<boolean> {
    const id = Number(profile?.id);

    try {
      await this.ensureConnected();

      await lastValueFrom(
        this.client.emit(eventName.profile.update, profile).pipe(
          timeout(2000),
          catchError((err) => {
            this.logger.error(
              `Emit failed for ${eventName.profile.update} (id=${id})`,
              (err as Error)?.stack ?? (err as Error)?.message ?? String(err),
            );
            return of(undefined);
          }),
        ),
      );

      this.logger.log(`Enqueued ${eventName.profile.update} (id=${id})`);
      return true;
    } catch (err) {
      this.logger.error(
        `Enqueue error for ${eventName.profile.update} (id=${id})`,
        (err as Error)?.stack ?? (err as Error)?.message ?? String(err),
      );
      return false;
    }
  }
}
