import { ModuleName } from '@/common/enums';
import { UpdateProjectDto } from '@/modules/projects/dtos';
import { ProjectEntity } from '@/modules/projects/entities';
import { FindOneProjectProvider } from '@/modules/projects/providers/find-one-project.provider';
import { ProjectRepository } from '@/modules/projects/repositories';
import { ErrorResponse } from '@/shared/responses';
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Not } from 'typeorm';

/**
 * @description Updates an existing `ProjectEntity` after validation.
 * Checks existence and prevents duplicate titles.
 * @category Providers
 */
@Injectable()
export class UpdateProjectProvider {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly findOneProject: FindOneProjectProvider,
    private readonly errorResponse: ErrorResponse,
  ) {}

  /**
   * @description Updates an `ProjectEntity` by ID.
   * @param id - Entity identifier.
   * @param dto - Update data.
   * @returns The updated `ProjectEntity`.
   * @throws NotFoundException if entity does not exist.
   * @throws BadRequestException if title already exists in another entity.
   */
  async execute(id: number, dto: UpdateProjectDto): Promise<ProjectEntity> {
    const { title } = dto;

    const existing = await this.findOneProject.execute({ id });
    if (!existing) {
      return this.errorResponse.notFound({
        module: ModuleName.Project,
        key: 'project-not-found',
      });
    }

    if (title) {
      const sameTitleQuery: FindOptionsWhere<ProjectEntity> = {
        title,
        id: Not(id),
      };
      const duplicate = await this.findOneProject.execute(sameTitleQuery);

      if (duplicate) {
        return this.errorResponse.badRequest({
          module: ModuleName.Project,
          key: 'project-already-exist',
        });
      }
    }

    const updated = await this.projectRepository.update({ id }, dto);
    return updated!;
  }
}
