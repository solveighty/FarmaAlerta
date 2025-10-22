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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return {
      message: 'GET /users - Obtener lista de todos los usuarios',
      description: 'Solo el administrador puede listar usuarios',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar usuario por ID' })
  @ApiResponse({ status: 200, description: 'Datos del usuario' })
  async findOne(@Param('id') id: string) {
    return {
      message: `GET /users/:id - Consultar usuario por ID (${id})`,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Crear usuario (por admin)' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  async create(@Body() createUserDto: CreateUserDto) {
    return {
      message: 'POST /users - Crear usuario (por admin)',
      description: 'Solo el administrador puede crear usuarios',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar información de usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return {
      message: `PATCH /users/:id - Actualizar información de usuario (${id})`,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  async remove(@Param('id') id: string) {
    return {
      message: `DELETE /users/:id - Eliminar usuario (${id})`,
      description: 'Solo el administrador puede eliminar usuarios',
    };
  }
}
