import { ModuleName } from '@/common/enums';
import { FindOneProjectProvider } from '@/modules/projects/providers/find-one-project.provider';
import { ProjectRepository } from '@/modules/projects/repositories';
import { ErrorResponse } from '@/shared/responses';
import { Injectable } from '@nestjs/common';

/**
 * @description Removes an `ProjectEntity` by ID after verifying its existence.
 * @category Providers
 */
@Injectable()
export class RemoveProjectProvider {
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
   * @description Deletes an `ProjectEntity` by its ID.
   * @param id - Unique identifier of the entity to remove.
   * @returns The deleted `ProjectEntity`.
   * @throws NotFoundException if the entity does not exist.
   */
  async execute(id: number) {
    const existing = await this.findOneProject.execute({ id });

    if (!existing) {
      return this.errorResponse.notFound({
        module: ModuleName.Project,
        key: 'project-not-found',
      });
    }

    await this.projectRepository.remove({ id });
    return existing;
  }
}
