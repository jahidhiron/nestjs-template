import { ConfigModule } from '@/config';
import { ProfileEntity, TaskEntity } from '@/modules/projects/entities';
import {
  CreateCompleteProjectProvider,
  CreateProjectProvider,
  FindOneProjectProvider,
  ProfileListProvider,
  ProjectListProvider,
  RemoveProjectProvider,
  TaskListProvider,
  UpdateProjectProvider,
} from '@/modules/projects/providers';
import {
  ProfileRepository,
  ProjectRepository,
  TaskRepository,
} from '@/modules/projects/repositories';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

/**
 * AccountModule
 *
 * Encapsulates all functionality related to team management.
 * Handles team creation, retrieval, update, deletion, and listing.
 *
 * @category Modules
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([ProfileEntity, ProfileEntity, TaskEntity]),
    SharedModule,
    ConfigModule,
  ],
  controllers: [ProjectController],
  providers: [
    ProjectRepository,
    ProfileRepository,
    TaskRepository,
    ProjectService,
    FindOneProjectProvider,
    CreateProjectProvider,
    UpdateProjectProvider,
    RemoveProjectProvider,
    ProjectListProvider,
    ProfileListProvider,
    TaskListProvider,
    CreateCompleteProjectProvider,
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
