import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RegisterPharmacyDto } from './dto/register-pharmacy.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { LoginPharmacyDto } from './dto/login-pharmacy.dto';
import { RefreshAdminDto } from './dto/refresh-admin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminOnlyGuard } from './guards/admin-only.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Post('register/pharmacy')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, AdminOnlyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new pharmacy (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Pharmacy registered successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin role required',
  })
  @ApiResponse({
    status: 409,
    description: 'Pharmacy with this email already exists',
  })
  async registerPharmacy(
    @Body() registerPharmacyDto: RegisterPharmacyDto,
    @Request() req: any,
  ) {
    return this.authService.registerPharmacy(registerPharmacyDto, req.user.id);
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

  @Post('login/pharmacy')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pharmacy login endpoint (role = pharmacy)' })
  @ApiResponse({ status: 200, description: 'Access and refresh tokens returned' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Forbidden - pharmacy role required' })
  async loginPharmacy(@Body() loginDto: LoginPharmacyDto, @Request() req: any) {
    const ipAddress = req.ip || req.connection.remoteAddress || '0.0.0.0';
    return this.authService.loginPharmacy(loginDto, ipAddress);
  }

  @Post('refresh/admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh admin access token' })
  @ApiResponse({
    status: 200,
    description: 'New access token generated',
    schema: {
      example: {
        access_token: 'nuevo_access_admin...',
        expires_in: 300,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - missing or invalid refresh token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or expired refresh token',
  })
  async refreshAdmin(@Body() refreshAdminDto: RefreshAdminDto) {
    return this.authService.refreshAdmin(refreshAdminDto.refresh_token);
  }
}
