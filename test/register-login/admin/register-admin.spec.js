"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const register_admin_use_case_1 = require("../../../src/modules/auth/use-case/register-admin.use-case");
const users_service_1 = require("../../../src/modules/users/users.service");
const audit_service_1 = require("../../../src/modules/audit/audit.service");
const user_entity_1 = require("../../../src/modules/users/entities/user.entity");
const config_1 = require("../../../src/config");
describe('RegisterAdminUseCase', () => {
    let useCase;
    let usersService;
    let auditService;
    const mockUsersService = {
        findByEmail: jest.fn(),
        create: jest.fn(),
    };
    const mockAuditService = {
        create: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                register_admin_use_case_1.RegisterAdminUseCase,
                {
                    provide: users_service_1.UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: audit_service_1.AuditService,
                    useValue: mockAuditService,
                },
            ],
        }).compile();
        useCase = module.get(register_admin_use_case_1.RegisterAdminUseCase);
        usersService = module.get(users_service_1.UsersService);
        auditService = module.get(audit_service_1.AuditService);
        jest.clearAllMocks();
    });
    describe('execute', () => {
        const validMasterKey = config_1.envs.MASTER_KEY;
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
            role: user_entity_1.UserRole.ADMIN,
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
                role: user_entity_1.UserRole.ADMIN,
            });
            expect(mockAuditService.create).toHaveBeenCalledWith(expect.objectContaining({
                action: 'ADMIN_REGISTER',
                entity: 'users',
                userId: newAdmin.id,
            }));
        });
        it('should throw UnauthorizedException when master key is invalid', async () => {
            const dtoWithInvalidKey = {
                ...validRegisterDto,
                masterKey: 'invalid-master-key',
            };
            await expect(useCase.execute(dtoWithInvalidKey)).rejects.toThrow(common_1.UnauthorizedException);
            expect(mockUsersService.findByEmail).not.toHaveBeenCalled();
            expect(mockUsersService.create).not.toHaveBeenCalled();
        });
        it('should throw BadRequestException when passwords do not match', async () => {
            const dtoWithMismatchPassword = {
                ...validRegisterDto,
                passwordConfirm: 'DifferentPassword123!',
            };
            await expect(useCase.execute(dtoWithMismatchPassword)).rejects.toThrow(common_1.BadRequestException);
            expect(mockUsersService.create).not.toHaveBeenCalled();
        });
        it('should throw BadRequestException when password is too short', async () => {
            const dtoWithShortPassword = {
                ...validRegisterDto,
                password: 'Short1!',
                passwordConfirm: 'Short1!',
            };
            await expect(useCase.execute(dtoWithShortPassword)).rejects.toThrow(common_1.BadRequestException);
            expect(mockUsersService.create).not.toHaveBeenCalled();
        });
        it('should throw BadRequestException when email already exists', async () => {
            mockUsersService.findByEmail.mockResolvedValue({
                id: 'existing-admin',
                email: 'admin@example.com',
            });
            await expect(useCase.execute(validRegisterDto)).rejects.toThrow(common_1.BadRequestException);
            expect(mockUsersService.create).not.toHaveBeenCalled();
        });
        it('should throw BadRequestException when user creation fails', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            mockUsersService.create.mockRejectedValue(new Error('Database error'));
            await expect(useCase.execute(validRegisterDto)).rejects.toThrow(common_1.BadRequestException);
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
            await expect(useCase.execute(dtoWithEmptyKey)).rejects.toThrow(common_1.UnauthorizedException);
            expect(mockUsersService.create).not.toHaveBeenCalled();
        });
    });
});
