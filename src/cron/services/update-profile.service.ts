import { AppLogger } from '@/config/logger';
import { UpdateProfileDto } from '@/modules/projects/dtos';
import { ProfileStatus } from '@/modules/projects/enums';
import { ProjectService } from '@/modules/projects/project.service';
import { UpdateProfileProducerService } from '@/rabbitmq/producers';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Cron, CronExpression } from '@nestjs/schedule';

/** Periodically picks profiles and sends them for async update processing. */
@Injectable()
export class UpdateProfileService implements OnModuleInit {
  private projectService!: ProjectService;
  private producer!: UpdateProfileProducerService;

  constructor(
    private readonly logger: AppLogger,
    private readonly moduleRef: ModuleRef,
  ) {}

  /**
   * Lazily resolves services to avoid circular dependencies.
   * Runs automatically when the module initializes.
   */
  async onModuleInit(): Promise<void> {
    this.projectService = await this.moduleRef.resolve(ProjectService, undefined, {
      strict: false,
    });
    this.producer = await this.moduleRef.resolve(UpdateProfileProducerService, undefined, {
      strict: false,
    });
  }

  /**
   * Cron job (every 1m):
   * 1. Pick eligible profiles (idle + due)
   * 2. Publish update jobs to RabbitMQ
   * 3. On publish fail → revert status back to ProfileStatus.Idle
   * 4. Log summary (success vs failed)
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleTodaySpendSync(): Promise<void> {
    const batchLimit = 50;

    try {
      const profiles = await this.projectService.pickProfileForEnqueue(batchLimit);

      if (!profiles?.length) {
        this.logger.log('No profiles to enqueue for update');
        return;
      }

      let ok = 0;
      let fail = 0;

      for (const p of profiles) {
        const id = Number(p?.id);

        const payload: UpdateProfileDto = {
          id,
          version: typeof p.version === 'number' && Number.isFinite(p.version) ? p.version : null,
        };

        const enqueued = await this.producer.updateProfileJob(payload);

        if (!enqueued) {
          fail++;
          // Revert queue state when publishing fails
          await this.projectService.updateProfile(
            { id, queueStatus: ProfileStatus.Queued },
            { queueStatus: ProfileStatus.Idle },
          );
        } else {
          ok++;
        }
      }

      this.logger.log(`UpdateProfile cron summary — enqueued: ${ok}, failed/skipped: ${fail}`);
    } catch (err) {
      this.logger.error(
        'UpdateProfile cron failed',
        (err as Error)?.stack ?? (err as Error)?.message ?? String(err),
      );
    }
  }
}
