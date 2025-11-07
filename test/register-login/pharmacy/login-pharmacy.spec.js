"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const login_pharmacy_use_case_1 = require("../../../src/modules/auth/use-case/login-pharmacy.use-case");
const users_service_1 = require("../../../src/modules/users/users.service");
const pharmacies_service_1 = require("../../../src/modules/pharmacies/pharmacies.service");
const audit_service_1 = require("../../../src/modules/audit/audit.service");
const redis_service_1 = require("../../../src/redis/redis.service");
const user_entity_1 = require("../../../src/modules/users/entities/user.entity");
// Mock bcrypt
jest.mock('bcrypt');
const bcrypt = __importStar(require("bcrypt"));
describe('LoginPharmacyUseCase', () => {
    let useCase;
    let usersService;
    let pharmaciesService;
    let auditService;
    let redisService;
    let jwtService;
    let configService;
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                login_pharmacy_use_case_1.LoginPharmacyUseCase,
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
                {
                    provide: redis_service_1.RedisService,
                    useValue: mockRedisService,
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: config_1.ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();
        useCase = module.get(login_pharmacy_use_case_1.LoginPharmacyUseCase);
        usersService = module.get(users_service_1.UsersService);
        pharmaciesService = module.get(pharmacies_service_1.PharmaciesService);
        auditService = module.get(audit_service_1.AuditService);
        redisService = module.get(redis_service_1.RedisService);
        jwtService = module.get(jwt_1.JwtService);
        configService = module.get(config_1.ConfigService);
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
            role: user_entity_1.UserRole.PHARMACY,
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
            bcrypt.compare.mockResolvedValue(true);
            mockPharmaciesService.findAll.mockResolvedValue({
                data: [pharmacyData],
            });
            mockConfigService.get.mockImplementation((key) => {
                if (key === 'JWT_EXPIRES_PHARMACY')
                    return 600;
                if (key === 'JWT_REFRESH_EXPIRES_PHARMACY')
                    return '3d';
                return undefined;
            });
            mockJwtService.sign.mockImplementation((payload, options) => {
                if (options?.expiresIn === 600)
                    return accessToken;
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
            expect(mockRedisService.set).toHaveBeenCalledWith(`refresh:pharmacy:${validUser.id}`, refreshToken, 259200);
            expect(mockAuditService.create).toHaveBeenCalledWith(expect.objectContaining({
                action: 'LOGIN_SUCCESS_PHARMACY',
                userId: validUser.id,
            }));
        });
        it('should throw UnauthorizedException when user not found', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            mockAuditService.create.mockResolvedValue(undefined);
            await expect(useCase.execute(loginDto, ipAddress)).rejects.toThrow(common_1.UnauthorizedException);
            expect(mockAuditService.create).toHaveBeenCalledWith(expect.objectContaining({
                action: 'LOGIN_FAILED_PHARMACY',
                details: expect.objectContaining({
                    reason: 'User not found',
                }),
            }));
        });
        it('should throw ForbiddenException when user role is not pharmacy', async () => {
            const adminUser = {
                ...validUser,
                role: user_entity_1.UserRole.ADMIN,
            };
            mockUsersService.findByEmail.mockResolvedValue(adminUser);
            mockAuditService.create.mockResolvedValue(undefined);
            await expect(useCase.execute(loginDto, ipAddress)).rejects.toThrow(common_1.ForbiddenException);
            expect(mockAuditService.create).toHaveBeenCalledWith(expect.objectContaining({
                action: 'LOGIN_FAILED_PHARMACY',
                details: expect.objectContaining({
                    reason: 'Invalid role',
                }),
            }));
        });
        it('should throw ForbiddenException when user is inactive', async () => {
            const inactiveUser = {
                ...validUser,
                isActive: false,
            };
            mockUsersService.findByEmail.mockResolvedValue(inactiveUser);
            mockAuditService.create.mockResolvedValue(undefined);
            await expect(useCase.execute(loginDto, ipAddress)).rejects.toThrow(common_1.ForbiddenException);
            expect(mockAuditService.create).toHaveBeenCalledWith(expect.objectContaining({
                action: 'LOGIN_FAILED_PHARMACY',
                details: expect.objectContaining({
                    reason: 'User is inactive',
                }),
            }));
        });
        it('should throw UnauthorizedException when password is invalid', async () => {
            mockUsersService.findByEmail.mockResolvedValue(validUser);
            bcrypt.compare.mockResolvedValue(false);
            mockAuditService.create.mockResolvedValue(undefined);
            await expect(useCase.execute(loginDto, ipAddress)).rejects.toThrow(common_1.UnauthorizedException);
            expect(mockAuditService.create).toHaveBeenCalledWith(expect.objectContaining({
                action: 'LOGIN_FAILED_PHARMACY',
                details: expect.objectContaining({
                    reason: 'Invalid password',
                }),
            }));
        });
        it('should throw BadRequestException when pharmacy record not found', async () => {
            mockUsersService.findByEmail.mockResolvedValue(validUser);
            bcrypt.compare.mockResolvedValue(true);
            mockPharmaciesService.findAll.mockResolvedValue({
                data: [], // No pharmacy found
            });
            mockConfigService.get.mockImplementation((key) => {
                if (key === 'JWT_EXPIRES_PHARMACY')
                    return 600;
                if (key === 'JWT_REFRESH_EXPIRES_PHARMACY')
                    return '3d';
                return undefined;
            });
            mockAuditService.create.mockResolvedValue(undefined);
            await expect(useCase.execute(loginDto, ipAddress)).rejects.toThrow(common_1.BadRequestException);
            // When pharmacy is not found, it throws immediately without audit logging that specific error
            // The audit log is created in the catch block for other errors
            expect(mockAuditService.create).not.toHaveBeenCalled();
        });
        it('should store refresh token in Redis with correct TTL', async () => {
            mockUsersService.findByEmail.mockResolvedValue(validUser);
            bcrypt.compare.mockResolvedValue(true);
            mockPharmaciesService.findAll.mockResolvedValue({
                data: [pharmacyData],
            });
            mockConfigService.get.mockImplementation((key) => {
                if (key === 'JWT_EXPIRES_PHARMACY')
                    return 600;
                if (key === 'JWT_REFRESH_EXPIRES_PHARMACY')
                    return '7d';
                return undefined;
            });
            mockJwtService.sign.mockImplementation((payload, options) => {
                if (options?.expiresIn === 600)
                    return accessToken;
                return refreshToken;
            });
            mockRedisService.set.mockResolvedValue(undefined);
            mockAuditService.create.mockResolvedValue(undefined);
            await useCase.execute(loginDto, ipAddress);
            expect(mockRedisService.set).toHaveBeenCalledWith(`refresh:pharmacy:${validUser.id}`, refreshToken, 604800);
        });
        it('should handle numeric TTL in config', async () => {
            mockUsersService.findByEmail.mockResolvedValue(validUser);
            bcrypt.compare.mockResolvedValue(true);
            mockPharmaciesService.findAll.mockResolvedValue({
                data: [pharmacyData],
            });
            mockConfigService.get.mockImplementation((key) => {
                if (key === 'JWT_EXPIRES_PHARMACY')
                    return 600;
                if (key === 'JWT_REFRESH_EXPIRES_PHARMACY')
                    return '86400'; // 1 day in seconds as string
                return undefined;
            });
            mockJwtService.sign.mockImplementation((payload, options) => {
                if (options?.expiresIn === 600)
                    return accessToken;
                return refreshToken;
            });
            mockRedisService.set.mockResolvedValue(undefined);
            mockAuditService.create.mockResolvedValue(undefined);
            await useCase.execute(loginDto, ipAddress);
            expect(mockRedisService.set).toHaveBeenCalledWith(`refresh:pharmacy:${validUser.id}`, refreshToken, 86400);
        });
    });
});
