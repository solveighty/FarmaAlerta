import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ description: 'Page number', default: 1 })
  page: number = 1;

  @ApiProperty({ description: 'Items per page', default: 10 })
  limit: number = 10;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Data array' })
  data: T[];

  @ApiProperty({ description: 'Total items count' })
  total: number;

  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total pages' })
  totalPages: number;
}
