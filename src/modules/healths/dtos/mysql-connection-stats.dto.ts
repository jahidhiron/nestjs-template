import { ApiProperty } from '@nestjs/swagger';

export class MySQLConnectionStatsDto {
  @ApiProperty({ example: 12, description: 'Current open connections' })
  current!: number;

  @ApiProperty({ example: 95, description: 'Peak concurrent connections since server start' })
  maxUsed!: number;

  @ApiProperty({ example: 151, description: 'Configured maximum allowed connections' })
  maxAllowed!: number;
}
