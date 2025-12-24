import { MetaDto } from '@/common/dtos';
import { DetailTaskDto } from '@/modules/projects/dtos/detail-task.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class TaskListResponseDto {
  @ApiProperty({ type: () => MetaDto })
  @Expose()
  @Type(() => MetaDto)
  meta: MetaDto;

  @ApiProperty({ type: () => [DetailTaskDto] })
  @Expose()
  @Type(() => DetailTaskDto)
  tasks: DetailTaskDto[];
}
