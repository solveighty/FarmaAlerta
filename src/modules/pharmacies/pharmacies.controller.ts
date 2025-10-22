import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PharmaciesService } from './pharmacies.service';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';

@ApiTags('Pharmacies')
@Controller('pharmacies')
export class PharmaciesController {
  constructor(private readonly pharmaciesService: PharmaciesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar farmacias registradas' })
  @ApiResponse({ status: 200, description: 'Lista de farmacias' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return {
      message: 'GET /pharmacies - Listar farmacias registradas',
      description: 'Devuelve todas las farmacias con información pública',
    };
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar farmacias por nombre o ciudad' })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda' })
  async search(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return {
      message: `GET /pharmacies/search?q=${query} - Buscar farmacias por nombre o ciudad`,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalles de una farmacia' })
  @ApiResponse({ status: 200, description: 'Datos de la farmacia' })
  async findOne(@Param('id') id: string) {
    return {
      message: `GET /pharmacies/:id - Obtener detalles de una farmacia (${id})`,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Registrar una farmacia' })
  @ApiResponse({ status: 201, description: 'Farmacia registrada exitosamente' })
  async create(@Body() createPharmacyDto: CreatePharmacyDto) {
    return {
      message: 'POST /pharmacies - Registrar una farmacia (por admin o farmacia misma)',
      description: 'Puede contener fields: name, address, lat, lng, opening_hours, etc.',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar información de farmacia' })
  @ApiResponse({ status: 200, description: 'Farmacia actualizada' })
  async update(
    @Param('id') id: string,
    @Body() updatePharmacyDto: UpdatePharmacyDto,
  ) {
    return {
      message: `PATCH /pharmacies/:id - Actualizar información (${id})`,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar farmacia (solo admin)' })
  @ApiResponse({ status: 200, description: 'Farmacia eliminada exitosamente' })
  async remove(@Param('id') id: string) {
    return {
      message: `DELETE /pharmacies/:id - Eliminar farmacia (${id}) (solo admin)`,
    };
  }
}
