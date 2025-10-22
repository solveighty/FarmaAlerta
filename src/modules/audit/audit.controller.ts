import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Audit')
@Controller('audit')
export class AuditController {
  @Get()
  @ApiOperation({ summary: 'Listar logs (solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros de auditoría',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return {
      message: 'GET /audit - Listar logs (solo admin)',
      description:
        'Devuelve todos los registros de auditoría del sistema con paginación',
    };
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Ver acciones realizadas por un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Acciones del usuario',
  })
  async findByUser(@Param('userId') userId: string) {
    return {
      message: `GET /audit/:userId - Ver acciones realizadas por un usuario (${userId})`,
      description: 'Devuelve todos los eventos registrados de un usuario específico',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Registrar acción (automático desde los servicios)' })
  @ApiResponse({
    status: 201,
    description: 'Acción registrada exitosamente',
  })
  async create(@Body() body: any) {
    return {
      message: 'POST /audit - Registrar acción (automático desde los servicios)',
      description:
        'Se ejecuta automáticamente desde los servicios para registrar acciones relevantes',
      note: 'Ideal para auditoría, roles y control de acceso (Gobierno de TI)',
    };
  }
}
