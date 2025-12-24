import { DetailProjectDto } from '@/modules/projects/dtos/detail-project.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class DetailProjectResponseDto {
  @ApiProperty({ type: () => DetailProjectDto })
  @Expose()
  @Type(() => DetailProjectDto)
  project: DetailProjectDto;
}
