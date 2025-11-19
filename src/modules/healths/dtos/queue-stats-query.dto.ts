import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueueStatsQueryDto {
  @ApiProperty({
    name: 'queue',
    required: false,
    description: 'Queue name (default: nest_template_queue)',
    example: 'nest_template_queue',
  })
  @IsOptional()
  @IsString()
  queue?: string;
}
