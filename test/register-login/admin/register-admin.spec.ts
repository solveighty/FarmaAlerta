import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterAdminUseCase } from '../../../src/modules/auth/use-case/register-admin.use-case';
import { UsersService } from '../../../src/modules/users/users.service';
import { AuditService } from '../../../src/modules/audit/audit.service';
import { UserRole } from '../../../src/modules/users/entities/user.entity';
import { envs } from '../../../src/config';

describe('RegisterAdminUseCase', () => {
  let useCase: RegisterAdminUseCase;
  let usersService: UsersService;
  let auditService: AuditService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockAuditService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterAdminUseCase,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    useCase = module.get<RegisterAdminUseCase>(RegisterAdminUseCase);
    usersService = module.get<UsersService>(UsersService);
    auditService = module.get<AuditService>(AuditService);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validMasterKey = envs.MASTER_KEY;
    const validRegisterDto = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'SecureAdminPassword123!',
      passwordConfirm: 'SecureAdminPassword123!',
      masterKey: validMasterKey,
    };

    const newAdmin = {
      id: 'admin-123',
      name: 'Admin User',
      email: 'admin@example.com',
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date(),
    };

    it('should register an admin successfully with valid master key', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(newAdmin);
      mockAuditService.create.mockResolvedValue(undefined);

      const result = await useCase.execute(validRegisterDto);

      expect(result).toEqual({
        message: 'Admin account created successfully. Please log in to access the application.',
        user: {
          id: newAdmin.id,
          email: newAdmin.email,
          name: newAdmin.name,
          role: newAdmin.role,
          isActive: newAdmin.isActive,
          createdAt: newAdmin.createdAt,
        },
      });

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('admin@example.com');
      expect(mockUsersService.create).toHaveBeenCalledWith({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'SecureAdminPassword123!',
        role: UserRole.ADMIN,
      });
      expect(mockAuditService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'ADMIN_REGISTER',
          entity: 'users',
          userId: newAdmin.id,
        }),
      );
    });

    it('should throw UnauthorizedException when master key is invalid', async () => {
      const dtoWithInvalidKey = {
        ...validRegisterDto,
        masterKey: 'invalid-master-key',
      };

      await expect(useCase.execute(dtoWithInvalidKey)).rejects.toThrow(UnauthorizedException);

      expect(mockUsersService.findByEmail).not.toHaveBeenCalled();
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when passwords do not match', async () => {
      const dtoWithMismatchPassword = {
        ...validRegisterDto,
        passwordConfirm: 'DifferentPassword123!',
      };

      await expect(useCase.execute(dtoWithMismatchPassword)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when password is too short', async () => {
      const dtoWithShortPassword = {
        ...validRegisterDto,
        password: 'Short1!',
        passwordConfirm: 'Short1!',
      };

      await expect(useCase.execute(dtoWithShortPassword)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when email already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'existing-admin',
        email: 'admin@example.com',
      });

      await expect(useCase.execute(validRegisterDto)).rejects.toThrow(BadRequestException);

      expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when user creation fails', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute(validRegisterDto)).rejects.toThrow(BadRequestException);

      expect(mockAuditService.create).not.toHaveBeenCalled();
    });

    it('should create audit log with correct details', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(newAdmin);
      mockAuditService.create.mockResolvedValue(undefined);

      await useCase.execute(validRegisterDto);

      expect(mockAuditService.create).toHaveBeenCalledWith({
        action: 'ADMIN_REGISTER',
        entity: 'users',
        entityId: newAdmin.id,
        userId: newAdmin.id,
        details: {
          email: newAdmin.email,
          name: newAdmin.name,
          role: newAdmin.role,
        },
      });
    });

    it('should reject registration with empty master key', async () => {
      const dtoWithEmptyKey = {
        ...validRegisterDto,
        masterKey: '',
      };

      await expect(useCase.execute(dtoWithEmptyKey)).rejects.toThrow(UnauthorizedException);

      expect(mockUsersService.create).not.toHaveBeenCalled();
    });
  });
});
