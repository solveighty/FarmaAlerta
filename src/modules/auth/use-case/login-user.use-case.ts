import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { AuditService } from '../../audit/audit.service';
import { RedisService } from '../../../redis/redis.service';
import { envs } from '../../../config';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly auditService: AuditService,
    private readonly redisService: RedisService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      await this.auditService.create({
        action: 'LOGIN_FAILED_USER',
        entity: 'users',
        details: { email },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role !== UserRole.USER) {
      throw new ForbiddenException('User role not allowed to login here');
    }

    const valid = await this.usersService.validatePassword(password, user.passwordHash);
    if (!valid) {
      await this.auditService.create({
        action: 'LOGIN_FAILED_USER',
        entity: 'users',
        entityId: user.id,
        userId: user.id,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, { expiresIn: envs.JWT_EXPIRES_USER });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: envs.JWT_REFRESH_EXPIRES_USER });

    // Store refresh token in Redis with TTL = 7 days (604800 seconds)
    const redisKey = `refresh:user:${user.id}`;
    await this.redisService.set(redisKey, refreshToken, 604800);

    await this.auditService.create({
      action: 'LOGIN_SUCCESS_USER',
      entity: 'users',
      entityId: user.id,
      userId: user.id,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    };
  }
}
