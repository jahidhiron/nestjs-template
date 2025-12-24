import { BaseRepository } from '@/common/repositories';
import { AppLogger } from '@/config/logger';
import { ErrorResponse } from '@/shared/responses';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProfileEntity } from '../entities';

@Injectable()
export class ProfileRepository extends BaseRepository<ProfileEntity> {
  constructor(
    protected readonly dataSource: DataSource,
    protected readonly errorResponse: ErrorResponse,
    protected readonly logger: AppLogger,
  ) {
    super(dataSource, ProfileEntity, 'profiles', errorResponse, logger);
  }
}
