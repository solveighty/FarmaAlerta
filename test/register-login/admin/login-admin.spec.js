"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const login_admin_use_case_1 = require("../../../src/modules/auth/use-case/login-admin.use-case");
const users_service_1 = require("../../../src/modules/users/users.service");
const audit_service_1 = require("../../../src/modules/audit/audit.service");
const redis_service_1 = require("../../../src/redis/redis.service");
const user_entity_1 = require("../../../src/modules/users/entities/user.entity");
const config_1 = require("../../../src/config");
describe('LoginAdminUseCase', () => {
    let useCase;
    let usersService;
    let auditService;
    let redisService;
    let jwtService;
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                login_admin_use_case_1.LoginAdminUseCase,
                {
                    provide: users_service_1.UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: audit_service_1.AuditService,
                    useValue: mockAuditService,
                },
                {
                    provide: redis_service_1.RedisService,
                    useValue: mockRedisService,
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();
        useCase = module.get(login_admin_use_case_1.LoginAdminUseCase);
        usersService = module.get(users_service_1.UsersService);
        auditService = module.get(audit_service_1.AuditService);
        redisService = module.get(redis_service_1.RedisService);
        jwtService = module.get(jwt_1.JwtService);
        jest.clearAllMocks();
    });
    describe('execute', () => {
        const email = 'admin@example.com';
        const password = 'SecureAdminPassword123!';
        const validAdmin = {
            id: 'admin-123',
            email: 'admin@example.com',
            name: 'Admin User',
            role: user_entity_1.UserRole.ADMIN,
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
                if (options?.expiresIn === config_1.envs.JWT_EXPIRES_ADMIN)
                    return accessToken;
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
            expect(mockRedisService.set).toHaveBeenCalledWith(`refresh:admin:${validAdmin.id}`, refreshToken, 86400);
            expect(mockAuditService.create).toHaveBeenCalledWith(expect.objectContaining({
                action: 'LOGIN_SUCCESS_ADMIN',
                userId: validAdmin.id,
            }));
        });
        it('should throw UnauthorizedException when user not found', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            mockAuditService.create.mockResolvedValue(undefined);
            await expect(useCase.execute(email, password)).rejects.toThrow(common_1.UnauthorizedException);
            expect(mockAuditService.create).toHaveBeenCalledWith(expect.objectContaining({
                action: 'LOGIN_FAILED_ADMIN',
                details: { email },
            }));
        });
        it('should throw ForbiddenException when user role is not admin', async () => {
            const pharmacyUser = {
                ...validAdmin,
                role: user_entity_1.UserRole.PHARMACY,
            };
            mockUsersService.findByEmail.mockResolvedValue(pharmacyUser);
            await expect(useCase.execute(email, password)).rejects.toThrow(common_1.ForbiddenException);
            expect(mockUsersService.validatePassword).not.toHaveBeenCalled();
            expect(mockAuditService.create).not.toHaveBeenCalled();
        });
        it('should throw UnauthorizedException when password is invalid', async () => {
            mockUsersService.findByEmail.mockResolvedValue(validAdmin);
            mockUsersService.validatePassword.mockResolvedValue(false);
            mockAuditService.create.mockResolvedValue(undefined);
            await expect(useCase.execute(email, password)).rejects.toThrow(common_1.UnauthorizedException);
            expect(mockAuditService.create).toHaveBeenCalledWith(expect.objectContaining({
                action: 'LOGIN_FAILED_ADMIN',
                userId: validAdmin.id,
            }));
        });
        it('should store refresh token in Redis with 1 day TTL', async () => {
            mockUsersService.findByEmail.mockResolvedValue(validAdmin);
            mockUsersService.validatePassword.mockResolvedValue(true);
            mockJwtService.sign.mockImplementation((payload, options) => {
                if (options?.expiresIn === config_1.envs.JWT_EXPIRES_ADMIN)
                    return accessToken;
                return refreshToken;
            });
            mockRedisService.set.mockResolvedValue(undefined);
            mockAuditService.create.mockResolvedValue(undefined);
            await useCase.execute(email, password);
            expect(mockRedisService.set).toHaveBeenCalledWith(`refresh:admin:${validAdmin.id}`, refreshToken, 86400);
        });
        it('should generate tokens with correct payload', async () => {
            mockUsersService.findByEmail.mockResolvedValue(validAdmin);
            mockUsersService.validatePassword.mockResolvedValue(true);
            mockJwtService.sign.mockImplementation((payload, options) => {
                if (options?.expiresIn === config_1.envs.JWT_EXPIRES_ADMIN)
                    return accessToken;
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
            expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload, expect.objectContaining({ expiresIn: config_1.envs.JWT_EXPIRES_ADMIN }));
            expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload, expect.objectContaining({ expiresIn: config_1.envs.JWT_REFRESH_EXPIRES_ADMIN }));
        });
        it('should audit failed login when user not found', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            mockAuditService.create.mockResolvedValue(undefined);
            try {
                await useCase.execute(email, password);
            }
            catch {
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
                if (options?.expiresIn === config_1.envs.JWT_EXPIRES_ADMIN)
                    return accessToken;
                return refreshToken;
            });
            mockRedisService.set.mockResolvedValue(undefined);
            mockAuditService.create.mockResolvedValue(undefined);
            await useCase.execute(email, password);
            expect(mockAuditService.create).toHaveBeenCalledWith(expect.objectContaining({
                action: 'LOGIN_SUCCESS_ADMIN',
                entity: 'users',
                entityId: validAdmin.id,
                userId: validAdmin.id,
            }));
        });
    });
});
