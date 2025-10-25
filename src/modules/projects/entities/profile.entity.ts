import { BaseEntity } from '@/common/entities';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ProjectEntity } from './project.entity';

@Entity('profiles')
export class ProfileEntity extends BaseEntity {
  @Column({ type: 'text', nullable: true })
  bio: string | null;

  /**
   * Owns the relation — holds the FK in DB
   */
  @OneToOne(() => ProjectEntity, (project) => project.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;
}
