import { ModuleName } from '@/common/enums';
import { FindOneProjectProvider } from '@/modules/projects/providers/find-one-project.provider';
import { ErrorResponse } from '@/shared/responses';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CreateCompleteProjectDto } from '../dtos';
import { ProfileRepository } from '../repositories/profile.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { TaskRepository } from '../repositories/task.repository';

@Injectable()
export class CreateCompleteProjectProvider {
  constructor(
    private readonly dataSource: DataSource,
    private readonly projectRepository: ProjectRepository,
    private readonly taskRepository: TaskRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly findOneProject: FindOneProjectProvider,
    private readonly errorResponse: ErrorResponse,
  ) {}

  /**
   * Creates a project with profile and tasks in a single transaction.
   * Rolls back if any step fails.
   * @param dto - Data for project, profile, and tasks
   * @returns Project with profile and tasks
   */
  async execute(dto: CreateCompleteProjectDto) {
    // Check for existing project
    const existing = await this.findOneProject.execute({ title: dto.title });
    if (existing) {
      return this.errorResponse.badRequest({
        module: ModuleName.Project,
        key: 'project-already-exist',
      });
    }

    return this.dataSource.transaction(async (manager: EntityManager) => {
      // Create Project
      const project = await this.projectRepository.create({ title: dto.title }, manager);

      // Create Profile
      await this.profileRepository.create({ bio: dto.bio ?? null, project }, manager);

      // Create Tasks
      if (dto.tasks?.length) {
        const tasks = dto.tasks.map((task) => ({ ...task, project }));
        await this.taskRepository.createMany(tasks, manager);
      }

      // Return full project
      return this.projectRepository.findOne(
        { id: project.id },
        { relations: { profile: true, tasks: true } },
        manager,
      );
    });
  }
}
