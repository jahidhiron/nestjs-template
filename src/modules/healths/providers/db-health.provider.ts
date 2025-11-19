import { AppLogger } from '@/config/logger';
import {
  DbErrorDto,
  DbHealthDto,
  DbHealthResponseDto,
  MySQLConnectionStatsDto,
} from '@/modules/healths/dtos';
import { ErrorResponse } from '@/shared/responses';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DbHealthProvider {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: AppLogger,
    private readonly errorResponse: ErrorResponse,
  ) {}

  /**
   * Check database health, latency, version, uptime, QPS, and connection stats
   * @returns Database health DTO or error response
   */
  async execute(): Promise<DbHealthResponseDto> {
    const result: DbHealthDto = {
      service: 'UP',
      database: 'UNKNOWN',
      dbLatencyMs: -1,
      timestamp: new Date(),
    };

    try {
      // Ping database and measure latency
      const start = Date.now();
      await this.dataSource.query('SELECT 1');
      const end = Date.now();
      result.database = 'UP';
      result.dbLatencyMs = end - start;

      // Fetch MySQL version
      const versionResult = await this.dataSource.query<{ version: string }[]>(
        'SELECT VERSION() AS version',
      );
      result.dbVersion = versionResult[0]?.version;

      // Fetch database uptime
      const uptimeResult = await this.dataSource.query<{ Variable_name: string; Value: string }[]>(
        "SHOW GLOBAL STATUS LIKE 'Uptime'",
      );
      result.dbUptimeSeconds = uptimeResult.length
        ? parseInt(uptimeResult[0].Value, 10)
        : undefined;

      // Fetch running threads
      const threadsResult = await this.dataSource.query<{ Value: string }[]>(
        "SHOW STATUS LIKE 'Threads_running'",
      );
      result.threadsRunning = threadsResult.length
        ? parseInt(threadsResult[0].Value, 10)
        : undefined;

      // Calculate queries per second (QPS)
      const questionsResult = await this.dataSource.query<{ Value: string }[]>(
        "SHOW STATUS LIKE 'Questions'",
      );
      const uptimeSec = result.dbUptimeSeconds || 1;
      const totalQueries = questionsResult.length ? parseInt(questionsResult[0].Value, 10) : 0;
      result.queriesPerSecond = parseFloat((totalQueries / uptimeSec).toFixed(2));

      // Fetch MySQL connection stats
      result.mysqlConnections = await this.getMySQLConnectionStats();
    } catch (err: unknown) {
      // Handle errors and log
      result.database = 'DOWN';
      const dbError: DbErrorDto = {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      };
      result.dbError = dbError;
      this.logger.error('Database health check failed: ' + dbError.message, dbError.stack);
      return this.errorResponse.internalServerError();
    }

    return { dbHealth: result };
  }

  /**
   * Get MySQL connection stats: current, peak, and max allowed
   * @returns MySQLConnectionStatsDto or undefined if query fails
   */
  private async getMySQLConnectionStats(): Promise<MySQLConnectionStatsDto | undefined> {
    try {
      const [threads, maxUsed, maxAllowed] = await Promise.all([
        this.dataSource.query<{ Value: string }[]>("SHOW STATUS LIKE 'Threads_connected'"),
        this.dataSource.query<{ Value: string }[]>("SHOW STATUS LIKE 'Max_used_connections'"),
        this.dataSource.query<{ Value: string }[]>("SHOW VARIABLES LIKE 'max_connections'"),
      ]);

      return {
        current: threads.length ? parseInt(threads[0].Value, 10) : 0,
        maxUsed: maxUsed.length ? parseInt(maxUsed[0].Value, 10) : 0,
        maxAllowed: maxAllowed.length ? parseInt(maxAllowed[0].Value, 10) : 151,
      };
    } catch (err: unknown) {
      this.logger.error(
        'Failed to fetch MySQL connection stats',
        err instanceof Error ? err.stack : String(err),
      );
      return undefined;
    }
  }
}
