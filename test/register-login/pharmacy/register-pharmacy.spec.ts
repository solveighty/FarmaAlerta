import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { RegisterPharmacyUseCase } from '../../../src/modules/auth/use-case/register-pharmacy.use-case';
import { UsersService } from '../../../src/modules/users/users.service';
import { PharmaciesService } from '../../../src/modules/pharmacies/pharmacies.service';
import { AuditService } from '../../../src/modules/audit/audit.service';
import { UserRole } from '../../../src/modules/users/entities/user.entity';

describe('RegisterPharmacyUseCase', () => {
  let useCase: RegisterPharmacyUseCase;
  let usersService: UsersService;
  let pharmaciesService: PharmaciesService;
  let auditService: AuditService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockPharmaciesService = {
    create: jest.fn(),
  };

  const mockAuditService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterPharmacyUseCase,
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
      ],
    }).compile();

    useCase = module.get<RegisterPharmacyUseCase>(RegisterPharmacyUseCase);
    usersService = module.get<UsersService>(UsersService);
    pharmaciesService = module.get<PharmaciesService>(PharmaciesService);
    auditService = module.get<AuditService>(AuditService);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const adminUserId = 'admin-123';
    const validRegisterDto = {
      name: 'Farmacia Central',
      email: 'central@pharmacy.com',
      password: 'SecurePass123!',
      passwordConfirm: 'SecurePass123!',
      address: 'Av. Libertad 321',
      city: 'La Paz',
      phone: '+593 998765432',
      latitude: -16.5,
      longitude: -68.15,
      openingHours: { open: '08:00', close: '22:00' },
    };

    const newUser = {
      id: 'user-123',
      name: 'Farmacia Central',
      email: 'central@pharmacy.com',
      role: UserRole.PHARMACY,
      isActive: true,
      createdAt: new Date(),
    };

    const newPharmacy = {
      id: 'pharmacy-123',
      userId: 'user-123',
      name: 'Farmacia Central',
      address: 'Av. Libertad 321',
      city: 'La Paz',
      phone: '+593 998765432',
      latitude: -16.5,
      longitude: -68.15,
      openingHours: { open: '08:00', close: '22:00' },
      createdAt: new Date(),
    };

    it('should register a pharmacy successfully', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(newUser);
      mockPharmaciesService.create.mockResolvedValue(newPharmacy);
      mockAuditService.create.mockResolvedValue(undefined);

      const result = await useCase.execute(validRegisterDto, adminUserId);

      expect(result).toEqual({
        message: 'Pharmacy registered successfully. Please log in to access the application.',
        pharmacy: {
          id: newPharmacy.id,
          userId: newUser.id,
          name: newPharmacy.name,
          email: newUser.email,
          address: newPharmacy.address,
          phone: newPharmacy.phone,
          openingHours: newPharmacy.openingHours,
          isActive: newUser.isActive,
          createdAt: newPharmacy.createdAt,
        },
      });

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('central@pharmacy.com');
      expect(mockUsersService.create).toHaveBeenCalledWith({
        name: 'Farmacia Central',
        email: 'central@pharmacy.com',
        password: 'SecurePass123!',
        role: UserRole.PHARMACY,
        phone: '+593 998765432',
      });
      expect(mockPharmaciesService.create).toHaveBeenCalled();
      expect(mockAuditService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'ADMIN_CREATE_PHARMACY',
          entity: 'pharmacies',
          userId: adminUserId,
        }),
      );
    });

    it('should throw BadRequestException when passwords do not match', async () => {
      const dtoWithMismatchPassword = {
        ...validRegisterDto,
        passwordConfirm: 'DifferentPass123!',
      };

      await expect(useCase.execute(dtoWithMismatchPassword, adminUserId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when password is too short', async () => {
      const dtoWithShortPassword = {
        ...validRegisterDto,
        password: 'Short1!',
        passwordConfirm: 'Short1!',
      };

      await expect(useCase.execute(dtoWithShortPassword, adminUserId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException when email already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'existing-user',
        email: 'central@pharmacy.com',
      });

      await expect(useCase.execute(validRegisterDto, adminUserId)).rejects.toThrow(
        ConflictException,
      );

      expect(mockAuditService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'ADMIN_CREATE_PHARMACY_FAILED',
          details: expect.objectContaining({
            reason: 'Email already exists',
          }),
        }),
      );
    });

    it('should throw BadRequestException when user creation fails', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute(validRegisterDto, adminUserId)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockAuditService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'ADMIN_CREATE_PHARMACY_FAILED',
        }),
      );
    });

    it('should create pharmacy without optional fields', async () => {
      const minimalDto = {
        name: 'Farmacia Simple',
        email: 'simple@pharmacy.com',
        password: 'SecurePass123!',
        passwordConfirm: 'SecurePass123!',
        address: 'Calle Principal 123',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({
        ...newUser,
        name: 'Farmacia Simple',
        email: 'simple@pharmacy.com',
      });
      mockPharmaciesService.create.mockResolvedValue({
        ...newPharmacy,
        name: 'Farmacia Simple',
        phone: undefined,
        city: undefined,
        openingHours: undefined,
      });
      mockAuditService.create.mockResolvedValue(undefined);

      const result = await useCase.execute(minimalDto, adminUserId);

      expect(result.pharmacy.name).toBe('Farmacia Simple');
      expect(mockPharmaciesService.create).toHaveBeenCalled();
    });

    it('should audit failed registration when email already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'existing-user',
        email: 'central@pharmacy.com',
      });

      try {
        await useCase.execute(validRegisterDto, adminUserId);
      } catch {
        // Expected to throw
      }

      expect(mockAuditService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'ADMIN_CREATE_PHARMACY_FAILED',
          entity: 'pharmacies',
          userId: adminUserId,
          details: expect.objectContaining({
            reason: 'Email already exists',
            email: 'central@pharmacy.com',
          }),
        }),
      );
    });
  });
});
