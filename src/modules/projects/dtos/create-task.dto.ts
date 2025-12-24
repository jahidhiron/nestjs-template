import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO representing a single task.
 */
export class CreateTaskDto {
  @ApiProperty({ description: 'Title of the task' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Optional description of the task' })
  @IsString()
  description?: string;
}
