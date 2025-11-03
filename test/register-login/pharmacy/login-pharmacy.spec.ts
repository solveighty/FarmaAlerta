import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginPharmacyUseCase } from '../../../src/modules/auth/use-case/login-pharmacy.use-case';
import { UsersService } from '../../../src/modules/users/users.service';
import { PharmaciesService } from '../../../src/modules/pharmacies/pharmacies.service';
import { AuditService } from '../../../src/modules/audit/audit.service';
import { RedisService } from '../../../src/redis/redis.service';
import { UserRole } from '../../../src/modules/users/entities/user.entity';

// Mock bcrypt
jest.mock('bcrypt');
import * as bcrypt from 'bcrypt';

describe('LoginPharmacyUseCase', () => {
  let useCase: LoginPharmacyUseCase;
  let usersService: UsersService;
  let pharmaciesService: PharmaciesService;
  let auditService: AuditService;
  let redisService: RedisService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockPharmaciesService = {
    findAll: jest.fn(),
  };

  const mockAuditService = {
    create: jest.fn(),
  };

  const mockRedisService = {
    set: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginPharmacyUseCase,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: PharmaciesService,
          useValue: mockPharmaciesService,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    useCase = module.get<LoginPharmacyUseCase>(LoginPharmacyUseCase);
    usersService = module.get<UsersService>(UsersService);
    pharmaciesService = module.get<PharmaciesService>(PharmaciesService);
    auditService = module.get<AuditService>(AuditService);
    redisService = module.get<RedisService>(RedisService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const loginDto = {
      email: 'pharmacy@example.com',
      password: 'SecurePass123!',
    };

    const ipAddress = '192.168.1.1';

    const validUser = {
      id: 'pharmacy-user-123',
      email: 'pharmacy@example.com',
      name: 'Farmacia Central',
      role: UserRole.PHARMACY,
      isActive: true,
      passwordHash: 'hashed_password',
      createdAt: new Date(),
    };

    const pharmacyData = {
      id: 'pharmacy-123',
      userId: 'pharmacy-user-123',
      name: 'Farmacia Central',
      address: 'Av. Libertad 321',
      city: 'La Paz',
      phone: '+593 998765432',
      createdAt: new Date(),
    };

    const accessToken = 'valid.access.token.pharmacy';
    const refreshToken = 'valid.refresh.token.pharmacy';

    it('should login pharmacy successfully', async () => {
      mockUsersService.findByEmail.mockResolvedValue(validUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPharmaciesService.findAll.mockResolvedValue({
        data: [pharmacyData],
      });
      mockConfigService.get.mockImplementation((key) => {
        if (key === 'JWT_EXPIRES_PHARMACY') return 600;
        if (key === 'JWT_REFRESH_EXPIRES_PHARMACY') return '3d';
        return undefined;
      });
      mockJwtService.sign.mockImplementation((payload, options) => {
        if (options?.expiresIn === 600) return accessToken;
        return refreshToken;
      });
      mockRedisService.set.mockResolvedValue(undefined);
      mockAuditService.create.mockResolvedValue(undefined);

      const result = await useCase.execute(loginDto, ipAddress);

      expect(result).toEqual({
        pharmacy: {
          id: pharmacyData.id,
          name: pharmacyData.name,
          email: validUser.email,
          role: validUser.role,
          isActive: validUser.isActive,
          createdAt: validUser.createdAt,
        },
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 600,
      });

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('pharmacy@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('SecurePass123!', 'hashed_password');
      expect(mockRedisService.set).toHaveBeenCalledWith(
        `refresh:pharmacy:${validUser.id}`,
        refreshToken,
        259200, // 3 days in seconds
      );
      expect(mockAuditService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'LOGIN_SUCCESS_PHARMACY',
          userId: validUser.id,
        }),
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockAuditService.create.mockResolvedValue(undefined);

      await expect(useCase.execute(loginDto, ipAddress)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockAuditService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'LOGIN_FAILED_PHARMACY',
          details: expect.objectContaining({
            reason: 'User not found',
          }),
        }),
      );
    });

    it('should throw ForbiddenException when user role is not pharmacy', async () => {
      const adminUser = {
        ...validUser,
        role: UserRole.ADMIN,
      };

      mockUsersService.findByEmail.mockResolvedValue(adminUser);
      mockAuditService.create.mockResolvedValue(undefined);

      await expect(useCase.execute(loginDto, ipAddress)).rejects.toThrow(ForbiddenException);

      expect(mockAuditService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'LOGIN_FAILED_PHARMACY',
          details: expect.objectContaining({
            reason: 'Invalid role',
          }),
        }),
      );
    });

    it('should throw ForbiddenException when user is inactive', async () => {
      const inactiveUser = {
        ...validUser,
        isActive: false,
      };

      mockUsersService.findByEmail.mockResolvedValue(inactiveUser);
      mockAuditService.create.mockResolvedValue(undefined);

      await expect(useCase.execute(loginDto, ipAddress)).rejects.toThrow(ForbiddenException);

      expect(mockAuditService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'LOGIN_FAILED_PHARMACY',
          details: expect.objectContaining({
            reason: 'User is inactive',
          }),
        }),
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(validUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      mockAuditService.create.mockResolvedValue(undefined);

      await expect(useCase.execute(loginDto, ipAddress)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockAuditService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'LOGIN_FAILED_PHARMACY',
          details: expect.objectContaining({
            reason: 'Invalid password',
          }),
        }),
      );
    });

    it('should throw BadRequestException when pharmacy record not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(validUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPharmaciesService.findAll.mockResolvedValue({
        data: [], // No pharmacy found
      });
      mockConfigService.get.mockImplementation((key) => {
        if (key === 'JWT_EXPIRES_PHARMACY') return 600;
        if (key === 'JWT_REFRESH_EXPIRES_PHARMACY') return '3d';
        return undefined;
      });
      mockAuditService.create.mockResolvedValue(undefined);

      await expect(useCase.execute(loginDto, ipAddress)).rejects.toThrow(
        BadRequestException,
      );

      // When pharmacy is not found, it throws immediately without audit logging that specific error
      // The audit log is created in the catch block for other errors
      expect(mockAuditService.create).not.toHaveBeenCalled();
    });

    it('should store refresh token in Redis with correct TTL', async () => {
      mockUsersService.findByEmail.mockResolvedValue(validUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPharmaciesService.findAll.mockResolvedValue({
        data: [pharmacyData],
      });
      mockConfigService.get.mockImplementation((key) => {
        if (key === 'JWT_EXPIRES_PHARMACY') return 600;
        if (key === 'JWT_REFRESH_EXPIRES_PHARMACY') return '7d';
        return undefined;
      });
      mockJwtService.sign.mockImplementation((payload, options) => {
        if (options?.expiresIn === 600) return accessToken;
        return refreshToken;
      });
      mockRedisService.set.mockResolvedValue(undefined);
      mockAuditService.create.mockResolvedValue(undefined);

      await useCase.execute(loginDto, ipAddress);

      expect(mockRedisService.set).toHaveBeenCalledWith(
        `refresh:pharmacy:${validUser.id}`,
        refreshToken,
        604800, // 7 days in seconds
      );
    });

    it('should handle numeric TTL in config', async () => {
      mockUsersService.findByEmail.mockResolvedValue(validUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPharmaciesService.findAll.mockResolvedValue({
        data: [pharmacyData],
      });
      mockConfigService.get.mockImplementation((key) => {
        if (key === 'JWT_EXPIRES_PHARMACY') return 600;
        if (key === 'JWT_REFRESH_EXPIRES_PHARMACY') return '86400'; // 1 day in seconds as string
        return undefined;
      });
      mockJwtService.sign.mockImplementation((payload, options) => {
        if (options?.expiresIn === 600) return accessToken;
        return refreshToken;
      });
      mockRedisService.set.mockResolvedValue(undefined);
      mockAuditService.create.mockResolvedValue(undefined);

      await useCase.execute(loginDto, ipAddress);

      expect(mockRedisService.set).toHaveBeenCalledWith(
        `refresh:pharmacy:${validUser.id}`,
        refreshToken,
        86400,
      );
    });
  });
});
