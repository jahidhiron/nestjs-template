import { ValidateSortBy } from '@/common/decorators';
import { ListOptionsDto, SortByDto } from '@/common/dtos';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

/**
 * DTO for querying contacts with filters, pagination, and sorting
 */
export class ProjectListQueryDto extends ListOptionsDto {
  /** Filter by profile ID */
  @ApiPropertyOptional({ description: 'Filter by profile ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  profileId?: number;

  @ValidateSortBy(SortByDto, ['id', 'title', 'profile.id', 'createdAt', 'updatedAt'])
  declare sortBy?: SortByDto[];
}
