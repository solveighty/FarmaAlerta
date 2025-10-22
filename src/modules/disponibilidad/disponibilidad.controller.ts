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
import { DisponibilidadService } from './disponibilidad.service';
import { CreateDisponibilidadDto } from './dto/create-disponibilidad.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';

@ApiTags('Disponibilidad')
@Controller('availability')
export class DisponibilidadController {
  constructor(private readonly disponibilidadService: DisponibilidadService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos los medicamentos con stock (solo admin)',
  })
  @ApiResponse({ status: 200, description: 'Lista de disponibilidad' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return {
      message:
        'GET /availability - Listar todos los medicamentos con stock (solo admin)',
      description:
        'Conecta farmacia + medicamento + cantidad + precio',
    };
  }

  @Get('pharmacy/:pharmacyId')
  @ApiOperation({ summary: 'Ver stock de una farmacia específica' })
  @ApiResponse({ status: 200, description: 'Stock de la farmacia' })
  async getByPharmacy(@Param('pharmacyId') pharmacyId: string) {
    return {
      message: `GET /availability/:pharmacyId - Ver stock de una farmacia específica (${pharmacyId})`,
    };
  }

  @Get('medicine/:medicineId')
  @ApiOperation({ summary: 'Ver farmacias que tienen un medicamento' })
  @ApiResponse({ status: 200, description: 'Farmacias con el medicamento' })
  async getByMedicine(@Param('medicineId') medicineId: string) {
    return {
      message: `GET /availability/medicine/:medicineId - Ver farmacias que tienen un medicamento (${medicineId})`,
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Registrar o actualizar disponibilidad (farmacia autenticada)',
  })
  @ApiResponse({
    status: 201,
    description: 'Disponibilidad registrada o actualizada',
  })
  async create(@Body() createDisponibilidadDto: CreateDisponibilidadDto) {
    return {
      message:
        'POST /availability - Registrar o actualizar disponibilidad (farmacia autenticada)',
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar cantidad o estado (stock/no stock)',
  })
  @ApiResponse({ status: 200, description: 'Disponibilidad actualizada' })
  async update(
    @Param('id') id: string,
    @Body() updateDisponibilidadDto: UpdateDisponibilidadDto,
  ) {
    return {
      message: `PATCH /availability/:id - Actualizar cantidad o estado (${id})`,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar registro de stock (opcional)' })
  @ApiResponse({ status: 200, description: 'Registro eliminado exitosamente' })
  async remove(@Param('id') id: string) {
    return {
      message: `DELETE /availability/:id - Eliminar registro de stock (${id})`,
    };
  }
}
