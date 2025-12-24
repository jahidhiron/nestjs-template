import { BaseEntity } from '@/common/entities';
import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { ProjectEntity } from './project.entity';

@Entity('profiles')
export class ProfileEntity extends BaseEntity {
  @Column({ type: 'text', nullable: true })
  bio: string | null;

  /**
   * Queue status for tracking background job progress
   */
  @Column({ type: 'varchar', length: 100, nullable: true, default: 'idle' })
  queueStatus: string | null;

  @Column({ type: 'int', nullable: true, default: null })
  version: number | null;

  /** Round-robin: pick oldest lastProcessedAt first */
  @Index('idx_profiles_last_processed_at')
  @Column({ type: 'datetime', nullable: true, default: null })
  lastProcessedAt: Date | null;

  /** Optional: for long tasks / crash recovery backoff */
  @Index('idx_profiles_next_run_at')
  @Column({ type: 'datetime', nullable: true, default: null })
  nextRunAt: Date | null;

  /**
   * Owns the relation — holds the FK in DB
   */
  @OneToOne(() => ProjectEntity, (project) => project.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;
}
