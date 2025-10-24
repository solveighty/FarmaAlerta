import { Controller, Post, Body, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginAdminDto } from './dto/login-admin.dto';

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

  @Post('login/user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login endpoint (role = user)' })
  @ApiResponse({ status: 200, description: 'Access and refresh tokens returned' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Forbidden - wrong role' })
  async loginUser(@Body() loginDto: LoginUserDto) {
    return this.authService.loginUser(loginDto.email, loginDto.password);
  }

  @Post('login/admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login endpoint (role = admin)' })
  @ApiResponse({ status: 200, description: 'Access and refresh tokens returned' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  async loginAdmin(@Body() loginDto: LoginAdminDto) {
    return this.authService.loginAdmin(loginDto.email, loginDto.password);
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
