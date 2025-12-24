import { BaseEntity } from '@/common/entities';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { TaskEntity } from './task.entity';

/**
 * Entity representing a project record.
 */
@Entity('projects')
export class ProjectEntity extends BaseEntity {
  /**
   * Title of the project record.
   */
  @Column({ type: 'varchar', length: 255 })
  title: string;

  /**
   * One-to-one relation with ProfileEntity.
   */
  @OneToOne(() => ProfileEntity, (profile) => profile.project)
  profile: ProfileEntity;

  /**
   * One-to-many relation with TaskEntity.
   */
  @OneToMany(() => TaskEntity, (task) => task.project)
  tasks: TaskEntity[];
}
