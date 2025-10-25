import { IsUniqueItemProperty } from '@/common/decorators';
import { CreateTaskDto } from '@/modules/projects/dtos/create-task.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * DTO representing a project with tasks.
 */
export class CreateCompleteProjectDto {
  @ApiProperty({
    description: 'Title of the project',
    example: 'Title 1',
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title should not be empty' })
  title: string;

  @ApiPropertyOptional({
    description: 'Bio or description of the project',
    example: 'Test Bio',
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({
    description: 'List of tasks associated with the project (optional)',
    type: [CreateTaskDto],
    example: [
      { title: 'Task 1', description: 'Description 1' },
      { title: 'Task 2', description: 'Description 2' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  @IsUniqueItemProperty('title', { message: 'Task titles must be unique' })
  tasks?: CreateTaskDto[];
}
