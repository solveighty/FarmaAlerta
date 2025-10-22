import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({
    summary: 'Búsqueda general (farmacias + medicamentos)',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultados de búsqueda',
    schema: {
      example: {
        message:
          'GET /search?q=ibuprofeno - Búsqueda general (farmacias + medicamentos)',
        description: 'Cache con Redis → devuelve en milisegundos si existe',
      },
    },
  })
  async search(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return {
      message: `GET /search?q=${query} - Búsqueda general (farmacias + medicamentos)`,
      description: 'Cache con Redis → devuelve en milisegundos si existe',
    };
  }

  @Get('medicines')
  @ApiOperation({ summary: 'Solo medicamentos' })
  @ApiResponse({ status: 200, description: 'Resultados de medicamentos' })
  async searchMedicines(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return {
      message: `GET /search/medicines?q=${query} - Solo medicamentos`,
      description: 'Cache con Redis',
    };
  }

  @Get('pharmacies')
  @ApiOperation({ summary: 'Solo farmacias' })
  @ApiResponse({ status: 200, description: 'Resultados de farmacias' })
  async searchPharmacies(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return {
      message: `GET /search/pharmacies?q=${query} - Solo farmacias`,
      description: 'Cache con Redis',
    };
  }

  @Get('nearby')
  @ApiOperation({
    summary: 'Farmacias cercanas al usuario (geolocalización)',
  })
  @ApiResponse({ status: 200, description: 'Farmacias cercanas' })
  async searchNearby(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radius') radius: number = 5,
  ) {
    return {
      message: `GET /search/nearby?lat=${lat}&lng=${lng}&radius=${radius} - Farmacias cercanas al usuario (geolocalización)`,
      description: 'Busca farmacias en un radio especificado usando coordenadas',
    };
  }
}
