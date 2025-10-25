import { BaseRepository } from '@/common/repositories';
import { AppLogger } from '@/config/logger';
import { ProjectEntity } from '@/modules/projects/entities';
import { ErrorResponse } from '@/shared/responses';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ProjectRepository extends BaseRepository<ProjectEntity> {
  constructor(
    protected readonly dataSource: DataSource,
    protected readonly errorResponse: ErrorResponse,
    protected readonly logger: AppLogger,
  ) {
    super(dataSource, ProjectEntity, 'projects', errorResponse, logger);
  }
}
