import { UpdateProfileDto } from '@/modules/projects/dtos';
import { ProfileEntity } from '@/modules/projects/entities';
import { FindOneProfileProvider } from '@/modules/projects/providers/find-one-profile.provider';
import { ProfileRepository } from '@/modules/projects/repositories';
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';

/**
 * @description Updates an existing `ProjectEntity` after validation.
 * Checks existence and prevents duplicate titles.
 * @category Providers
 */
@Injectable()
export class UpdateProfileProvider {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly FindOneProfile: FindOneProfileProvider,
  ) {}

  /**
   * @description Updates an `ProjectEntity` by ID.
   * @param query - FindOptionsWhere<ProfileEntity>.
   * @param dto - Update data.
   * @returns The updated `ProjectEntity`.
   * @throws NotFoundException if entity does not exist.
   * @throws BadRequestException if title already exists in another entity.
   */
  async execute(
    query: FindOptionsWhere<ProfileEntity>,
    dto: UpdateProfileDto,
  ): Promise<ProfileEntity | null> {
    const existing = await this.FindOneProfile.execute(query);
    if (!existing) {
      return null;
    }

    const updated = await this.profileRepository.update(query, dto);
    return updated!;
  }
}
