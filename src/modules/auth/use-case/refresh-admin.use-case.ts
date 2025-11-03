import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../../../redis/redis.service';
import { envs } from '../../../config';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RefreshAdminUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async execute(refreshToken: string) {
    // Validate JWT
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Verify role is admin
    if (payload.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Refresh token role must be admin');
    }

    // Verify token exists in Redis
    const redisKey = `refresh:admin:${payload.sub}`;
    const storedToken = await this.redisService.get(redisKey);

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token not found in Redis');
    }

    if (storedToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token mismatch');
    }

    // Generate new access token (5 minutes)
    const newPayload = {
      email: payload.email,
      sub: payload.sub,
      role: payload.role,
    };

    const newAccessToken = this.jwtService.sign(newPayload, {
      expiresIn: envs.JWT_EXPIRES_ADMIN,
    });

    return {
      access_token: newAccessToken,
      expires_in: 300, // 5 minutes in seconds
    };
  }
}
