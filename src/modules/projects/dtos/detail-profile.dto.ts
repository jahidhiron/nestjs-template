import { ProjectDto } from '@/modules/projects/dtos/project.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProfileDto } from './profile.dto';

export class DetailProfileDto extends ProfileDto {
  @ApiProperty({ type: ProjectDto })
  @Expose()
  @Type(() => ProjectDto)
  project!: ProjectDto;
}
