import { ProjectDto } from '@/modules/projects/dtos/project.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ProjectResponseDto {
  @ApiProperty({ type: () => ProjectDto })
  @Expose()
  @Type(() => ProjectDto)
  project: ProjectDto;
}
