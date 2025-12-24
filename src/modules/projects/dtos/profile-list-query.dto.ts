import { ValidateSortBy } from '@/common/decorators';
import { ListOptionsDto, SortByDto } from '@/common/dtos';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

/**
 * DTO for querying contacts with filters, pagination, and sorting
 */
export class ProfileListQueryDto extends ListOptionsDto {
  /** Filter by project ID */
  @ApiPropertyOptional({ description: 'Filter by project ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  projectId?: number;

  @ValidateSortBy(SortByDto, ['id', 'bio', 'project.id', 'createdAt', 'updatedAt'])
  declare sortBy?: SortByDto[];
}
