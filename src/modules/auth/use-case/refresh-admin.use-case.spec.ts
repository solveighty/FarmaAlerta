import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { RefreshAdminUseCase } from './refresh-admin.use-case';
import { RedisService } from '../../../redis/redis.service';
import { UserRole } from '../../users/entities/user.entity';
import { envs } from '../../../config';

describe('RefreshAdminUseCase', () => {
  let useCase: RefreshAdminUseCase;
  let jwtService: JwtService;
  let redisService: RedisService;

  const mockJwtService = {
    verify: jest.fn(),
    sign: jest.fn(),
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshAdminUseCase,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    useCase = module.get<RefreshAdminUseCase>(RefreshAdminUseCase);
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validPayload = {
      email: 'admin@example.com',
      sub: 'user-123',
      role: UserRole.ADMIN,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 1 day
    };

    const validRefreshToken = 'valid.refresh.token';
    const newAccessToken = 'new.access.token';

    it('should return new access token when refresh token is valid', async () => {
      mockJwtService.verify.mockReturnValue(validPayload);
      mockRedisService.get.mockResolvedValue(validRefreshToken);
      mockJwtService.sign.mockReturnValue(newAccessToken);

      const result = await useCase.execute(validRefreshToken);

      expect(result).toEqual({
        access_token: newAccessToken,
        expires_in: 300,
      });

      expect(mockJwtService.verify).toHaveBeenCalledWith(validRefreshToken);
      expect(mockRedisService.get).toHaveBeenCalledWith(`refresh:admin:${validPayload.sub}`);
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          email: validPayload.email,
          sub: validPayload.sub,
          role: validPayload.role,
        },
        { expiresIn: envs.JWT_EXPIRES_ADMIN },
      );
    });

    it('should throw UnauthorizedException when JWT is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(useCase.execute('invalid.token')).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockJwtService.verify).toHaveBeenCalledWith('invalid.token');
    });

    it('should throw UnauthorizedException when role is not admin', async () => {
      const nonAdminPayload = { ...validPayload, role: 'pharmacy' };
      mockJwtService.verify.mockReturnValue(nonAdminPayload);

      await expect(useCase.execute(validRefreshToken)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockJwtService.verify).toHaveBeenCalledWith(validRefreshToken);
    });

    it('should throw UnauthorizedException when token not found in Redis', async () => {
      mockJwtService.verify.mockReturnValue(validPayload);
      mockRedisService.get.mockResolvedValue(null);

      await expect(useCase.execute(validRefreshToken)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockRedisService.get).toHaveBeenCalledWith(`refresh:admin:${validPayload.sub}`);
    });

    it('should throw UnauthorizedException when token mismatch in Redis', async () => {
      mockJwtService.verify.mockReturnValue(validPayload);
      mockRedisService.get.mockResolvedValue('different.stored.token');

      await expect(useCase.execute(validRefreshToken)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockRedisService.get).toHaveBeenCalledWith(`refresh:admin:${validPayload.sub}`);
    });
  });
});
