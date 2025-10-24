import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginPharmacyDto } from '../dto/login-pharmacy.dto';
import { UsersService } from '../../users/users.service';
import { AuditService } from '../../audit/audit.service';
import { RedisService } from '../../../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../users/entities/user.entity';
import { PharmaciesService } from '../../pharmacies/pharmacies.service';

@Injectable()
export class LoginPharmacyUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly pharmaciesService: PharmaciesService,
    private readonly auditService: AuditService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    loginPharmacyDto: LoginPharmacyDto,
    ipAddress: string,
  ): Promise<{
    pharmacy: any;
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    // Find user by email
    const user = await this.usersService.findByEmail(loginPharmacyDto.email);

    if (!user) {
      await this.auditService.create({
        action: 'LOGIN_FAILED_PHARMACY',
        entity: 'users',
        details: {
          reason: 'User not found',
          email: loginPharmacyDto.email,
          ip: ipAddress,
        },
      });
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if role is pharmacy
    if (user.role !== UserRole.PHARMACY) {
      await this.auditService.create({
        action: 'LOGIN_FAILED_PHARMACY',
        entity: 'users',
        userId: user.id,
        details: {
          reason: 'Invalid role',
          email: loginPharmacyDto.email,
          ip: ipAddress,
        },
      });
      throw new ForbiddenException('User is not a pharmacy');
    }

    // Check if user is active
    if (!user.isActive) {
      await this.auditService.create({
        action: 'LOGIN_FAILED_PHARMACY',
        entity: 'users',
        userId: user.id,
        details: {
          reason: 'User is inactive',
          email: loginPharmacyDto.email,
          ip: ipAddress,
        },
      });
      throw new ForbiddenException('User account is inactive');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(
      loginPharmacyDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      await this.auditService.create({
        action: 'LOGIN_FAILED_PHARMACY',
        entity: 'users',
        userId: user.id,
        details: {
          reason: 'Invalid password',
          email: loginPharmacyDto.email,
          ip: ipAddress,
        },
      });
      throw new UnauthorizedException('Invalid email or password');
    }

    try {
      // Get pharmacy data
      const pharmacies = await this.pharmaciesService.findAll(1, 100);
      const pharmacy = pharmacies.data.find((p) => p.userId === user.id);

      if (!pharmacy) {
        throw new BadRequestException('Pharmacy record not found for this user');
      }

      // Generate tokens
      const accessTokenExpiresIn = this.configService.get<number>(
        'JWT_EXPIRES_PHARMACY',
        600,
      ); // 10 minutes default
      const refreshTokenExpiresInStr = this.configService.get<string>(
        'JWT_REFRESH_EXPIRES_PHARMACY',
        '259200',
      );
      
      // Parse TTL in seconds (e.g., "3d" -> 259200 seconds)
      let refreshTokenExpiresInSeconds = 259200; // default 3 days
      if (typeof refreshTokenExpiresInStr === 'string') {
        if (refreshTokenExpiresInStr.endsWith('d')) {
          refreshTokenExpiresInSeconds = parseInt(refreshTokenExpiresInStr) * 86400;
        } else if (refreshTokenExpiresInStr.endsWith('h')) {
          refreshTokenExpiresInSeconds = parseInt(refreshTokenExpiresInStr) * 3600;
        } else if (refreshTokenExpiresInStr.endsWith('m')) {
          refreshTokenExpiresInSeconds = parseInt(refreshTokenExpiresInStr) * 60;
        } else {
          refreshTokenExpiresInSeconds = parseInt(refreshTokenExpiresInStr);
        }
      }

      const payload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: accessTokenExpiresIn,
      });

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: refreshTokenExpiresInStr,
      });

      // Store refresh token in Redis with TTL in seconds
      await this.redisService.set(
        `refresh:pharmacy:${user.id}`,
        refreshToken,
        refreshTokenExpiresInSeconds,
      );

      // Audit log success
      await this.auditService.create({
        action: 'LOGIN_SUCCESS_PHARMACY',
        entity: 'users',
        userId: user.id,
        details: {
          pharmacyId: pharmacy.id,
          email: user.email,
          ip: ipAddress,
        },
      });

      return {
        pharmacy: {
          id: pharmacy.id,
          name: pharmacy.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: accessTokenExpiresIn,
      };
    } catch (error) {
      // Log failed attempt
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      await this.auditService.create({
        action: 'LOGIN_FAILED_PHARMACY',
        entity: 'users',
        userId: user.id,
        details: {
          reason: error instanceof Error ? error.message : 'Unknown error',
          email: loginPharmacyDto.email,
          ip: ipAddress,
          errorStack: error instanceof Error ? error.stack : '',
        },
      });

      console.error('[LoginPharmacyUseCase] Error:', error);
      throw new BadRequestException('An error occurred during login');
    }
  }
}
