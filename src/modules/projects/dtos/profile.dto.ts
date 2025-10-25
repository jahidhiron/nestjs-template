import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProfileDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'Bio Description' })
  @Expose()
  bio: string;

  @ApiProperty({ example: '2025-10-08T11:29:46.000Z' })
  @Expose()
  createdAt: string;

  @ApiProperty({ example: '2025-10-08T11:29:46.000Z' })
  @Expose()
  updatedAt: string;
}
