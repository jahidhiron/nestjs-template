import { MetaDto } from '@/common/dtos';
import { DetailProjectDto } from '@/modules/projects/dtos/detail-project.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ProjectListResponseDto {
  @ApiProperty({ type: () => MetaDto })
  @Expose()
  @Type(() => MetaDto)
  meta: MetaDto;

  @ApiProperty({ type: () => [DetailProjectDto] })
  @Expose()
  @Type(() => DetailProjectDto)
  projects: DetailProjectDto[];
}
