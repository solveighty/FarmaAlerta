"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const refresh_admin_use_case_1 = require("../../../src/modules/auth/use-case/refresh-admin.use-case");
const redis_service_1 = require("../../../src/redis/redis.service");
const user_entity_1 = require("../../../src/modules/users/entities/user.entity");
const config_1 = require("../../../src/config");
describe('RefreshAdminUseCase', () => {
    let useCase;
    let jwtService;
    let redisService;
    const mockJwtService = {
        verify: jest.fn(),
        sign: jest.fn(),
    };
    const mockRedisService = {
        get: jest.fn(),
        set: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                refresh_admin_use_case_1.RefreshAdminUseCase,
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: redis_service_1.RedisService,
                    useValue: mockRedisService,
                },
            ],
        }).compile();
        useCase = module.get(refresh_admin_use_case_1.RefreshAdminUseCase);
        jwtService = module.get(jwt_1.JwtService);
        redisService = module.get(redis_service_1.RedisService);
        jest.clearAllMocks();
    });
    describe('execute', () => {
        const validPayload = {
            email: 'admin@example.com',
            sub: 'user-123',
            role: user_entity_1.UserRole.ADMIN,
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
            expect(mockJwtService.sign).toHaveBeenCalledWith({
                email: validPayload.email,
                sub: validPayload.sub,
                role: validPayload.role,
            }, { expiresIn: config_1.envs.JWT_EXPIRES_ADMIN });
        });
        it('should throw UnauthorizedException when JWT is invalid', async () => {
            mockJwtService.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });
            await expect(useCase.execute('invalid.token')).rejects.toThrow(common_1.UnauthorizedException);
            expect(mockJwtService.verify).toHaveBeenCalledWith('invalid.token');
        });
        it('should throw UnauthorizedException when role is not admin', async () => {
            const nonAdminPayload = { ...validPayload, role: 'pharmacy' };
            mockJwtService.verify.mockReturnValue(nonAdminPayload);
            await expect(useCase.execute(validRefreshToken)).rejects.toThrow(common_1.UnauthorizedException);
            expect(mockJwtService.verify).toHaveBeenCalledWith(validRefreshToken);
        });
        it('should throw UnauthorizedException when token not found in Redis', async () => {
            mockJwtService.verify.mockReturnValue(validPayload);
            mockRedisService.get.mockResolvedValue(null);
            await expect(useCase.execute(validRefreshToken)).rejects.toThrow(common_1.UnauthorizedException);
            expect(mockRedisService.get).toHaveBeenCalledWith(`refresh:admin:${validPayload.sub}`);
        });
        it('should throw UnauthorizedException when token mismatch in Redis', async () => {
            mockJwtService.verify.mockReturnValue(validPayload);
            mockRedisService.get.mockResolvedValue('different.stored.token');
            await expect(useCase.execute(validRefreshToken)).rejects.toThrow(common_1.UnauthorizedException);
            expect(mockRedisService.get).toHaveBeenCalledWith(`refresh:admin:${validPayload.sub}`);
        });
    });
});
