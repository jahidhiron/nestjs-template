import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProfileDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'Bio Description' })
  @Expose()
  bio: string;

  @ApiPropertyOptional({ example: 'Queue status' })
  @Expose()
  queueStatus?: string;

  @ApiPropertyOptional({ example: 'Profile version' })
  @Expose()
  version?: number;

  @ApiProperty({ example: '2025-10-08T11:29:46.000Z' })
  @Expose()
  createdAt: string;

  @ApiProperty({ example: '2025-10-08T11:29:46.000Z' })
  @Expose()
  updatedAt: string;
}
