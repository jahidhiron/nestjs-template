import { ProjectDto } from '@/modules/projects/dtos/project.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProfileDto } from './profile.dto';
import { TaskDto } from './task.dto';

export class DetailProjectDto extends ProjectDto {
  @ApiProperty({ example: 5 })
  @Expose()
  totalTasks: number;

  @ApiProperty({ type: ProfileDto })
  @Expose()
  @Type(() => ProfileDto)
  profile!: ProfileDto;

  @ApiProperty({ type: [TaskDto] })
  @Expose()
  @Type(() => TaskDto)
  tasks!: TaskDto[];
}
