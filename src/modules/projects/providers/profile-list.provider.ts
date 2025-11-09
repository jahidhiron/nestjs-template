import { ListWithMeta } from '@/common/repositories/types';
import { ProfileListQueryDto } from '@/modules/projects/dtos';
import { ProfileEntity } from '@/modules/projects/entities';
import { ProfileRepository } from '@/modules/projects/repositories';
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';

/**
 * @class ProfileListProvider
 * @description Handles retrieval of paginated and filtered lists of profiles.
 */
@Injectable()
export class ProfileListProvider {
  constructor(private readonly profileRepository: ProfileRepository) {}

  /**
   * @method execute
   * @description Fetches paginated profiles with optional search, sorting, and relations.
   * @param {ProfileListQueryDto} dto - Query parameters for pagination and filtering.
   * @returns {Promise<ListWithMeta<ProfileEntity, 'profiles'>>} Paginated profiles with metadata.
   */
  async execute(dto: ProfileListQueryDto): Promise<ListWithMeta<ProfileEntity, 'profiles'>> {
    const { q, page, limit, sortBy, projectId } = dto;

    const query: FindOptionsWhere<ProfileEntity> = {};
    if (projectId) {
      query.project = { id: projectId };
    }

    const result = await this.profileRepository.paginatedList({
      q,
      query,
      searchBy: ['bio'],
      page,
      limit,
      sortBy,
      relations: { project: true },
    });

    return {
      meta: result.meta,
      profiles: result.items,
    };
  }
}
