import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Global search across medicines and pharmacies' })
  @ApiResponse({ status: 200, description: 'Search results' })
  async search(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.searchService.search(query, page, limit);
  }

  @Get('medicines')
  @ApiOperation({ summary: 'Search medicines' })
  @ApiResponse({ status: 200, description: 'Medicine search results' })
  async searchMedicines(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.searchService.searchMedicines(query, page, limit);
  }

  @Get('pharmacies')
  @ApiOperation({ summary: 'Search pharmacies' })
  @ApiResponse({ status: 200, description: 'Pharmacy search results' })
  async searchPharmacies(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.searchService.searchPharmacies(query, page, limit);
  }
}
