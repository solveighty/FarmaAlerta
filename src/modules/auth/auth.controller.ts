import { Controller, Post, Body, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/user')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully. Please log in to access the application.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error or password mismatch',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('register/admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new admin with master key' })
  @ApiResponse({
    status: 201,
    description: 'Admin account created successfully. Please log in to access the application.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error or password mismatch',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid master key',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  async registerAdmin(@Body() registerAdminDto: RegisterAdminDto) {
    return this.authService.registerAdmin(registerAdminDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión y obtener JWT' })
  @ApiResponse({
    status: 200,
    description: 'JWT token obtenido exitosamente',
  })
  async login(@Body() body: any) {
    return {
      message: 'POST /auth/login - Iniciar sesión y obtener JWT',
      data: this.authService.login(body),
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar el token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Token renovado exitosamente',
  })
  async refreshToken(@Body() body: any) {
    return {
      message: 'POST /auth/refresh - Renovar el token JWT',
      data: this.authService.generateToken(body),
    };
  }

  @Get('profile')
  @ApiOperation({ summary: 'Obtener datos del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Datos del usuario obtenidos',
  })
  async getProfile() {
    return {
      message: 'GET /auth/profile - Obtener datos del usuario autenticado',
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Sesión cerrada exitosamente',
  })
  async logout() {
    return {
      message: 'POST /auth/logout - Cerrar sesión (invalida token)',
    };
  }
}
