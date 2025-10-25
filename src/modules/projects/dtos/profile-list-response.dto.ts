import { MetaDto } from '@/common/dtos';
import { DetailProfileDto } from '@/modules/projects/dtos/detail-profile.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ProfileListResponseDto {
  @ApiProperty({ type: () => MetaDto })
  @Expose()
  @Type(() => MetaDto)
  meta: MetaDto;

  @ApiProperty({ type: () => [DetailProfileDto] })
  @Expose()
  @Type(() => DetailProfileDto)
  profiles: DetailProfileDto[];
}
