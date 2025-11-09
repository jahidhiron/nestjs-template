import { ListWithMeta } from '@/common/repositories/types';
import { TaskListQueryDto } from '@/modules/projects/dtos';
import { TaskEntity } from '@/modules/projects/entities';
import { TaskRepository } from '@/modules/projects/repositories';
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';

/**
 * @class TaskListProvider
 * @description Handles retrieval of paginated and filtered lists of tasks.
 */
@Injectable()
export class TaskListProvider {
  constructor(private readonly taskRepository: TaskRepository) {}

  /**
   * @method execute
   * @description Fetches paginated tasks with optional search, sorting, and relations.
   * @param {TaskListQueryDto} dto - Query parameters for pagination and filtering.
   * @returns {Promise<ListWithMeta<TaskEntity, 'tasks'>>} Paginated tasks with metadata.
   */
  async execute(dto: TaskListQueryDto): Promise<ListWithMeta<TaskEntity, 'tasks'>> {
    const { q, page, limit, sortBy, projectId } = dto;

    const query: FindOptionsWhere<TaskEntity> = {};
    if (projectId) {
      query.project = { id: projectId };
    }

    const result = await this.taskRepository.paginatedList({
      q,
      query,
      searchBy: ['title'],
      page,
      limit,
      sortBy,
      relations: { project: true },
    });

    return {
      meta: result.meta,
      tasks: result.items,
    };
  }
}
