import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProjectDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'Title 1' })
  @Expose()
  title: string;

  @ApiProperty({ example: '2025-10-08T11:29:46.000Z' })
  @Expose()
  createdAt: string;

  @ApiProperty({ example: '2025-10-08T11:29:46.000Z' })
  @Expose()
  updatedAt: string;
}
