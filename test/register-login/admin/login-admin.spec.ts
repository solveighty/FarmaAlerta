import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { LoginAdminUseCase } from '../../../src/modules/auth/use-case/login-admin.use-case';
import { UsersService } from '../../../src/modules/users/users.service';
import { AuditService } from '../../../src/modules/audit/audit.service';
import { RedisService } from '../../../src/redis/redis.service';
import { UserRole } from '../../../src/modules/users/entities/user.entity';
import { envs } from '../../../src/config';

describe('LoginAdminUseCase', () => {
  let useCase: LoginAdminUseCase;
  let usersService: UsersService;
  let auditService: AuditService;
  let redisService: RedisService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    validatePassword: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginAdminUseCase,
        {
          provide: UsersService,
          useValue: mockUsersService,
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
      ],
    }).compile();

    useCase = module.get<LoginAdminUseCase>(LoginAdminUseCase);
    usersService = module.get<UsersService>(UsersService);
    auditService = module.get<AuditService>(AuditService);
    redisService = module.get<RedisService>(RedisService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const email = 'admin@example.com';
    const password = 'SecureAdminPassword123!';

    const validAdmin = {
      id: 'admin-123',
      email: 'admin@example.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      isActive: true,
      passwordHash: 'hashed_password',
      createdAt: new Date(),
    };

    const accessToken = 'valid.access.token.admin';
    const refreshToken = 'valid.refresh.token.admin';

    it('should login admin successfully with valid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue(validAdmin);
      mockUsersService.validatePassword.mockResolvedValue(true);
      mockJwtService.sign.mockImplementation((payload, options) => {
        if (options?.expiresIn === envs.JWT_EXPIRES_ADMIN) return accessToken;
        return refreshToken;
      });
      mockRedisService.set.mockResolvedValue(undefined);
      mockAuditService.create.mockResolvedValue(undefined);

      const result = await useCase.execute(email, password);

      expect(result).toEqual({
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: validAdmin.id,
          email: validAdmin.email,
          name: validAdmin.name,
          role: validAdmin.role,
          isActive: validAdmin.isActive,
          createdAt: validAdmin.createdAt,
        },
      });

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockUsersService.validatePassword).toHaveBeenCalledWith(password, validAdmin.passwordHash);
      expect(mockRedisService.set).toHaveBeenCalledWith(
        `refresh:admin:${validAdmin.id}`,
        refreshToken,
        86400,
      );
      expect(mockAuditService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'LOGIN_SUCCESS_ADMIN',
          userId: validAdmin.id,
        }),
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockAuditService.create.mockResolvedValue(undefined);

      await expect(useCase.execute(email, password)).rejects.toThrow(UnauthorizedException);

      expect(mockAuditService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'LOGIN_FAILED_ADMIN',
          details: { email },
        }),
      );
    });

    it('should throw ForbiddenException when user role is not admin', async () => {
      const pharmacyUser = {
        ...validAdmin,
        role: UserRole.PHARMACY,
      };

      mockUsersService.findByEmail.mockResolvedValue(pharmacyUser);

      await expect(useCase.execute(email, password)).rejects.toThrow(ForbiddenException);

      expect(mockUsersService.validatePassword).not.toHaveBeenCalled();
      expect(mockAuditService.create).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(validAdmin);
      mockUsersService.validatePassword.mockResolvedValue(false);
      mockAuditService.create.mockResolvedValue(undefined);

      await expect(useCase.execute(email, password)).rejects.toThrow(UnauthorizedException);

      expect(mockAuditService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'LOGIN_FAILED_ADMIN',
          userId: validAdmin.id,
        }),
      );
    });

    it('should store refresh token in Redis with 1 day TTL', async () => {
      mockUsersService.findByEmail.mockResolvedValue(validAdmin);
      mockUsersService.validatePassword.mockResolvedValue(true);
      mockJwtService.sign.mockImplementation((payload, options) => {
        if (options?.expiresIn === envs.JWT_EXPIRES_ADMIN) return accessToken;
        return refreshToken;
      });
      mockRedisService.set.mockResolvedValue(undefined);
      mockAuditService.create.mockResolvedValue(undefined);

      await useCase.execute(email, password);

      expect(mockRedisService.set).toHaveBeenCalledWith(
        `refresh:admin:${validAdmin.id}`,
        refreshToken,
        86400, // 1 day in seconds
      );
    });

    it('should generate tokens with correct payload', async () => {
      mockUsersService.findByEmail.mockResolvedValue(validAdmin);
      mockUsersService.validatePassword.mockResolvedValue(true);
      mockJwtService.sign.mockImplementation((payload, options) => {
        if (options?.expiresIn === envs.JWT_EXPIRES_ADMIN) return accessToken;
        return refreshToken;
      });
      mockRedisService.set.mockResolvedValue(undefined);
      mockAuditService.create.mockResolvedValue(undefined);

      await useCase.execute(email, password);

      const expectedPayload = {
        email: validAdmin.email,
        sub: validAdmin.id,
        role: validAdmin.role,
      };

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expectedPayload,
        expect.objectContaining({ expiresIn: envs.JWT_EXPIRES_ADMIN }),
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expectedPayload,
        expect.objectContaining({ expiresIn: envs.JWT_REFRESH_EXPIRES_ADMIN }),
      );
    });

    it('should audit failed login when user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockAuditService.create.mockResolvedValue(undefined);

      try {
        await useCase.execute(email, password);
      } catch {
        // Expected to throw
      }

      expect(mockAuditService.create).toHaveBeenCalledWith({
        action: 'LOGIN_FAILED_ADMIN',
        entity: 'users',
        details: { email },
      });
    });

    it('should audit successful login with user ID', async () => {
      mockUsersService.findByEmail.mockResolvedValue(validAdmin);
      mockUsersService.validatePassword.mockResolvedValue(true);
      mockJwtService.sign.mockImplementation((payload, options) => {
        if (options?.expiresIn === envs.JWT_EXPIRES_ADMIN) return accessToken;
        return refreshToken;
      });
      mockRedisService.set.mockResolvedValue(undefined);
      mockAuditService.create.mockResolvedValue(undefined);

      await useCase.execute(email, password);

      expect(mockAuditService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'LOGIN_SUCCESS_ADMIN',
          entity: 'users',
          entityId: validAdmin.id,
          userId: validAdmin.id,
        }),
      );
    });
  });
});
