import { AppLogger } from '@/config/logger';
import {
  DbHealthStatusDto,
  DbHealthStatusResponseDto,
  MySQLConnectionStatsDto,
} from '@/modules/healths/dtos';
import { ErrorResponse } from '@/shared/responses';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * @description Creates a new `ProjectEntity` after verifying it does not already exist.
 * @category Providers
 */
@Injectable()
export class DbHealthStatusProvider {
  /**
   * @param projectRepository - Repository for `ProjectEntity`.
   * @param findOneProject - Provider to check for existing `ProjectEntity`.
   * @param errorResponse - Service to handle errors.
   */
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: AppLogger,
    private readonly errorResponse: ErrorResponse,
  ) {}

  /**
   * @description Creates a new Project entity if it does not exist.
   * @param dto - Data Transfer Object containing creation data.
   * @returns The created `ProjectEntity`.
   * @throws NotFoundException if an entity with the same title already exists.
   */
  async execute(): Promise<DbHealthStatusResponseDto> {
    const result: DbHealthStatusDto = {
      service: 'UP',
      database: 'UNKNOWN',
      db_latency_ms: -1,
      timestamp: new Date(),
    };

    try {
      const start = Date.now();
      await this.dataSource.query('SELECT 1');
      const end = Date.now();

      result.database = 'UP';
      result.db_latency_ms = end - start;

      const connectionStats = await this.getMySQLConnectionStats();
      if (connectionStats) {
        result.mysqlConnections = connectionStats;
      }
    } catch (err: unknown) {
      result.database = 'DOWN';
      result.error = err instanceof Error ? err.message : 'Unknown error';
    }

    return { dbHealthStatus: result };
  }

  private async getMySQLConnectionStats(): Promise<MySQLConnectionStatsDto | null> {
    try {
      // Define the expected result type for each query
      const [threadsConnected, maxUsedConnections, maxConnections] = await Promise.all([
        this.dataSource.query<{ Value: string }[]>("SHOW STATUS LIKE 'Threads_connected'"),
        this.dataSource.query<{ Value: string }[]>("SHOW STATUS LIKE 'Max_used_connections'"),
        this.dataSource.query<{ Value: string }[]>("SHOW VARIABLES LIKE 'max_connections'"),
      ]);

      return {
        current: parseInt(threadsConnected[0]?.Value || '0', 10),
        maxUsed: parseInt(maxUsedConnections[0]?.Value || '0', 10),
        maxAllowed: parseInt(maxConnections[0]?.Value || '151', 10),
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error('Failed to fetch MySQL connection stats', err.stack);
      } else {
        this.logger.error('Failed to fetch MySQL connection stats: ' + String(err));
      }
      return null;
    }
  }
}
