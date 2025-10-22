import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Alerts')
@Controller('alerts')
export class AlertsController {
  @Post()
  @ApiOperation({ summary: 'Crear alerta para un medicamento' })
  @ApiResponse({
    status: 201,
    description: 'Alerta creada exitosamente',
  })
  async create(@Body() body: any) {
    return {
      message: 'POST /alerts - Crear alerta para un medicamento',
      description:
        'El usuario se suscribe para recibir notificaciones cuando el medicamento vuelva a estar disponible',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Ver alertas activas del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Lista de alertas activas',
  })
  async findAll() {
    return {
      message: 'GET /alerts - Ver alertas activas del usuario',
      description: 'Devuelve todas las alertas del usuario autenticado',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar alerta' })
  @ApiResponse({
    status: 200,
    description: 'Alerta cancelada exitosamente',
  })
  async remove(@Param('id') id: string) {
    return {
      message: `DELETE /alerts/:id - Cancelar alerta (${id})`,
      description: 'Elimina la suscripción a notificaciones del medicamento',
    };
  }
}
