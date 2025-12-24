import { ProjectDto } from '@/modules/projects/dtos/project.dto';
import { TaskDto } from '@/modules/projects/dtos/task.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class DetailTaskDto extends TaskDto {
  @ApiProperty({ type: ProjectDto })
  @Expose()
  @Type(() => ProjectDto)
  project!: ProjectDto;
}
