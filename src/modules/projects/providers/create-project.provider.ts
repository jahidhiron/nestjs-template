import { ModuleName } from '@/common/enums';
import { CreateProjectDto } from '@/modules/projects/dtos';
import { ProjectEntity } from '@/modules/projects/entities';
import { FindOneProjectProvider } from '@/modules/projects/providers/find-one-project.provider';
import { ProjectRepository } from '@/modules/projects/repositories';
import { ErrorResponse } from '@/shared/responses';
import { Injectable } from '@nestjs/common';

/**
 * @description Creates a new `ProjectEntity` after verifying it does not already exist.
 * @category Providers
 */
@Injectable()
export class CreateProjectProvider {
  /**
   * @param projectRepository - Repository for `ProjectEntity`.
   * @param findOneProject - Provider to check for existing `ProjectEntity`.
   * @param errorResponse - Service to handle errors.
   */
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly findOneProject: FindOneProjectProvider,
    private readonly errorResponse: ErrorResponse,
  ) {}

  /**
   * @description Creates a new Project entity if it does not exist.
   * @param dto - Data Transfer Object containing creation data.
   * @returns The created `ProjectEntity`.
   * @throws NotFoundException if an entity with the same title already exists.
   */
  async execute(dto: CreateProjectDto): Promise<ProjectEntity> {
    const existing = await this.findOneProject.execute({ title: dto.title });

    if (existing) {
      return this.errorResponse.badRequest({
        module: ModuleName.Project,
        key: 'project-already-exist',
      });
    }

    return this.projectRepository.create(dto);
  }
}
