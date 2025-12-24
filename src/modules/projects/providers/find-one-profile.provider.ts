import { FindOneProvider } from '@/common/providers';
import { ProfileEntity } from '@/modules/projects/entities';
import { ProfileRepository } from '@/modules/projects/repositories';
import { Injectable } from '@nestjs/common';

/**
 * @description Retrieves a single `ProfileEntity` by query criteria.
 * Extends `FindOneProvider` for `ProfileEntity` and `ProfileRepository`.
 * @category Providers
 */
@Injectable()
export class FindOneProfileProvider extends FindOneProvider<ProfileEntity, ProfileRepository> {
  /**
   * @param profileRepository - Repository for `ProfileEntity`.
   */
  constructor(profileRepository: ProfileRepository) {
    super(profileRepository);
  }
}
