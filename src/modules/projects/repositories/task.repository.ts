import { BaseRepository } from '@/common/repositories';
import { AppLogger } from '@/config/logger';
import { ErrorResponse } from '@/shared/responses';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TaskEntity } from '../entities';

@Injectable()
export class TaskRepository extends BaseRepository<TaskEntity> {
  constructor(
    protected readonly dataSource: DataSource,
    protected readonly errorResponse: ErrorResponse,
    protected readonly logger: AppLogger,
  ) {
    super(dataSource, TaskEntity, 'tasks', errorResponse, logger);
  }
}
