import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

import { getAffectedCount } from '@/common/repositories/helpers';
import { AppLogger } from '@/config/logger';
import { ProfileStatus } from '@/modules/projects/enums';
import { ClaimedProfile as PickedProfile } from '@/modules/projects/providers/interfaces';
import { ProfileRepository } from '@/modules/projects/repositories/profile.repository';

@Injectable()
export class PickProfileForEnqueueProvider {
  constructor(
    private readonly dataSource: DataSource,
    private readonly profileRepository: ProfileRepository,
    private readonly logger: AppLogger,
  ) {}

  /**
   * Picks up to N eligible profiles in a single transaction and marks them as `queued`.
   *
   * **Eligibility**
   * - `queue_status = ${ProfileStatus.Idle}`
   * - `next_run_at IS NULL` or `next_run_at <= NOW()`
   *
   * **Fairness ordering**
   * - Lowest `version` first
   * - Then oldest `last_processed_at`
   * - Then lowest `id`
   *
   * **Behavior**
   * - Uses a single CTE+UPDATE+RETURNING for Postgres (atomic, fast)
   * - Uses SELECT → guarded UPDATE → re-select sequence for MySQL/MariaDB
   * - Returns only the profiles successfully marked `queued`
   *
   * @param {number} limit - Maximum number of profiles to pick (1–1000)
   * @returns {Promise<PickedProfile[]>} List of picked `{id, version}` rows
   */
  async execute(limit = 5): Promise<PickedProfile[]> {
    const clamped = Math.max(1, Math.min(limit, 1000));
    const driver = this.dataSource.options.type;

    return this.dataSource.transaction(async (manager: EntityManager) => {
      /** ---------- PostgreSQL (optimal single-statement) ---------- */
      if (driver === 'postgres') {
        const picked = await this.profileRepository.rawQuery<PickedProfile>(
          `
          WITH cte AS (
            SELECT id
            FROM profiles
            WHERE queue_status = '${ProfileStatus.Idle}'
              AND (next_run_at IS NULL OR next_run_at <= NOW())
            ORDER BY
              COALESCE(version, 0),
              last_processed_at NULLS FIRST,
              id
            LIMIT $1
            FOR UPDATE SKIP LOCKED
          )
          UPDATE profiles p
          SET queue_status = '${ProfileStatus.Queued}'
          FROM cte
          WHERE p.id = cte.id
            AND p.queue_status = '${ProfileStatus.Idle}'
          RETURNING p.id, p.version;
          `,
          [clamped],
          manager,
        );

        return picked;
      }

      /** ---------- MySQL / MariaDB branch ---------- */

      // 1) SELECT eligible candidates with fairness ordering
      const candidates = await this.profileRepository.rawQuery<PickedProfile>(
        `
        SELECT id, version
        FROM profiles
        WHERE queue_status = '${ProfileStatus.Idle}'
          AND (next_run_at IS NULL OR next_run_at <= NOW())
        ORDER BY
          COALESCE(version, 0) ASC,
          (last_processed_at IS NULL) DESC,
          last_processed_at ASC,
          id ASC
        LIMIT ?
        FOR UPDATE SKIP LOCKED
        `,
        [clamped],
        manager,
      );

      if (!candidates.length) return [];

      // 2) Guarded UPDATE
      const ids = candidates.map((p) => p.id);
      const placeholders = ids.map(() => '?').join(',');

      const updateRes = await this.profileRepository.rawQuery<any>(
        `
        UPDATE profiles
        SET queue_status = '${ProfileStatus.Queued}'
        WHERE id IN (${placeholders})
          AND queue_status = '${ProfileStatus.Idle}'
        `,
        ids,
        manager,
      );

      const affected = getAffectedCount(updateRes);
      if ((affected ?? 0) !== ids.length) {
        this.logger.warn(
          `Pick mismatch (fair): selected=${ids.length}, updated=${affected}. Returning only actually queued.`,
        );
      }

      // 3) Re-select rows that were actually queued
      const picked = await this.profileRepository.rawQuery<PickedProfile>(
        `
        SELECT id, version
        FROM profiles
        WHERE id IN (${placeholders})
          AND queue_status = '${ProfileStatus.Queued}'
        `,
        ids,
        manager,
      );

      return picked;
    });
  }
}
