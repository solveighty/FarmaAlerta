"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const register_pharmacy_use_case_1 = require("../../../src/modules/auth/use-case/register-pharmacy.use-case");
const users_service_1 = require("../../../src/modules/users/users.service");
const pharmacies_service_1 = require("../../../src/modules/pharmacies/pharmacies.service");
const audit_service_1 = require("../../../src/modules/audit/audit.service");
const user_entity_1 = require("../../../src/modules/users/entities/user.entity");
describe('RegisterPharmacyUseCase', () => {
    let useCase;
    let usersService;
    let pharmaciesService;
    let auditService;
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                register_pharmacy_use_case_1.RegisterPharmacyUseCase,
                {
                    provide: users_service_1.UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: pharmacies_service_1.PharmaciesService,
                    useValue: mockPharmaciesService,
                },
                {
                    provide: audit_service_1.AuditService,
                    useValue: mockAuditService,
                },
            ],
        }).compile();
        useCase = module.get(register_pharmacy_use_case_1.RegisterPharmacyUseCase);
        usersService = module.get(users_service_1.UsersService);
        pharmaciesService = module.get(pharmacies_service_1.PharmaciesService);
        auditService = module.get(audit_service_1.AuditService);
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
            role: user_entity_1.UserRole.PHARMACY,
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
                role: user_entity_1.UserRole.PHARMACY,
                phone: '+593 998765432',
            });
            expect(mockPharmaciesService.create).toHaveBeenCalled();
            expect(mockAuditService.create).toHaveBeenCalledWith(expect.objectContaining({
                action: 'ADMIN_CREATE_PHARMACY',
                entity: 'pharmacies',
                userId: adminUserId,
            }));
        });
        it('should throw BadRequestException when passwords do not match', async () => {
            const dtoWithMismatchPassword = {
                ...validRegisterDto,
                passwordConfirm: 'DifferentPass123!',
            };
            await expect(useCase.execute(dtoWithMismatchPassword, adminUserId)).rejects.toThrow(common_1.BadRequestException);
        });
        it('should throw BadRequestException when password is too short', async () => {
            const dtoWithShortPassword = {
                ...validRegisterDto,
                password: 'Short1!',
                passwordConfirm: 'Short1!',
            };
            await expect(useCase.execute(dtoWithShortPassword, adminUserId)).rejects.toThrow(common_1.BadRequestException);
        });
        it('should throw ConflictException when email already exists', async () => {
            mockUsersService.findByEmail.mockResolvedValue({
                id: 'existing-user',
                email: 'central@pharmacy.com',
            });
            await expect(useCase.execute(validRegisterDto, adminUserId)).rejects.toThrow(common_1.ConflictException);
            expect(mockAuditService.create).toHaveBeenCalledWith(expect.objectContaining({
                action: 'ADMIN_CREATE_PHARMACY_FAILED',
                details: expect.objectContaining({
                    reason: 'Email already exists',
                }),
            }));
        });
        it('should throw BadRequestException when user creation fails', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            mockUsersService.create.mockRejectedValue(new Error('Database error'));
            await expect(useCase.execute(validRegisterDto, adminUserId)).rejects.toThrow(common_1.BadRequestException);
            expect(mockAuditService.create).toHaveBeenCalledWith(expect.objectContaining({
                action: 'ADMIN_CREATE_PHARMACY_FAILED',
            }));
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
            }
            catch {
                // Expected to throw
            }
            expect(mockAuditService.create).toHaveBeenCalledWith(expect.objectContaining({
                action: 'ADMIN_CREATE_PHARMACY_FAILED',
                entity: 'pharmacies',
                userId: adminUserId,
                details: expect.objectContaining({
                    reason: 'Email already exists',
                    email: 'central@pharmacy.com',
                }),
            }));
        });
    });
});
