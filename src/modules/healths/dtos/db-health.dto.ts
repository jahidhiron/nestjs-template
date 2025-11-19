import { DbErrorDto } from '@/modules/healths/dtos/db-error.dto';
import { MySQLConnectionStatsDto } from '@/modules/healths/dtos/mysql-connection-stats.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class DbHealthDto {
  @ApiProperty({ example: 'UP', enum: ['UP', 'DOWN', 'UNKNOWN'] })
  service!: 'UP' | 'DOWN' | 'UNKNOWN';

  @ApiProperty({ example: 'UP', enum: ['UP', 'DOWN', 'UNKNOWN'] })
  database!: 'UP' | 'DOWN' | 'UNKNOWN';

  @ApiProperty({ example: 7, description: 'DB ping latency in milliseconds' })
  dbLatencyMs!: number;

  @ApiProperty({ example: '8.0.34', required: false, description: 'MySQL version' })
  dbVersion?: string;

  @ApiProperty({ example: 3600, required: false, description: 'DB uptime in seconds' })
  dbUptimeSeconds?: number;

  @ApiProperty({ example: 3, required: false, description: 'Current running threads' })
  threadsRunning?: number;

  @ApiProperty({ example: 120, required: false, description: 'Estimated queries per second' })
  queriesPerSecond?: number;

  @ApiProperty({ type: String, format: 'date-time' })
  @Type(() => Date)
  timestamp!: Date;

  @ApiProperty({ type: MySQLConnectionStatsDto, required: false })
  mysqlConnections?: MySQLConnectionStatsDto;

  @ApiProperty({ type: DbErrorDto, required: false, description: 'DB error occurred' })
  dbError?: DbErrorDto;
}
