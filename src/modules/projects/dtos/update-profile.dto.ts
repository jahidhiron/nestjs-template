import { Transform } from 'class-transformer';
import { IsInt, IsISO8601, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  bio?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  queueStatus?: string | null;

  @IsOptional()
  @IsInt()
  version?: number | null;

  @IsOptional()
  @IsISO8601()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' || typeof value === 'number' ? new Date(value) : null,
  )
  lastProcessedAt?: Date | null;

  @IsOptional()
  @IsISO8601()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' || typeof value === 'number' ? new Date(value) : null,
  )
  nextRunAt?: Date | null;
}
