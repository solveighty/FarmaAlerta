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
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@ApiTags('Medicines')
@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los medicamentos disponibles' })
  @ApiResponse({ status: 200, description: 'Lista de medicamentos' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return {
      message: 'GET /medicines - Listar todos los medicamentos disponibles',
      description: 'Catálogo base de medicamentos (no inventario de farmacias)',
    };
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar medicamentos por nombre o principio activo' })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda' })
  async search(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return {
      message: `GET /medicines/search?q=${query} - Buscar medicamentos por nombre o principio activo`,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener medicamento por ID' })
  @ApiResponse({ status: 200, description: 'Datos del medicamento' })
  async findOne(@Param('id') id: string) {
    return {
      message: `GET /medicines/:id - Obtener medicamento por ID (${id})`,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo medicamento (solo admin)' })
  @ApiResponse({ status: 201, description: 'Medicamento creado exitosamente' })
  async create(@Body() createMedicineDto: CreateMedicineDto) {
    return {
      message: 'POST /medicines - Crear nuevo medicamento (solo admin)',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos del medicamento' })
  @ApiResponse({ status: 200, description: 'Medicamento actualizado' })
  async update(
    @Param('id') id: string,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ) {
    return {
      message: `PATCH /medicines/:id - Actualizar datos del medicamento (${id})`,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar medicamento (solo admin)' })
  @ApiResponse({ status: 200, description: 'Medicamento eliminado exitosamente' })
  async remove(@Param('id') id: string) {
    return {
      message: `DELETE /medicines/:id - Eliminar medicamento (${id}) (solo admin)`,
    };
  }
}
