import { FindOneProvider } from '@/common/providers';
import { ProjectEntity } from '@/modules/projects/entities';
import { ProjectRepository } from '@/modules/projects/repositories';
import { Injectable } from '@nestjs/common';

/**
 * @description Retrieves a single `ProjectEntity` by query criteria.
 * Extends `FindOneProvider` for `ProjectEntity` and `ProjectRepository`.
 * @category Providers
 */
@Injectable()
export class FindOneProjectProvider extends FindOneProvider<ProjectEntity, ProjectRepository> {
  /**
   * @param projectRepository - Repository for `ProjectEntity`.
   */
  constructor(projectRepository: ProjectRepository) {
    super(projectRepository);
  }
}
