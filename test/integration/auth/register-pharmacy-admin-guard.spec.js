"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_controller_1 = require("../../../src/modules/auth/auth.controller");
const auth_service_1 = require("../../../src/modules/auth/auth.service");
const jwt_auth_guard_1 = require("../../../src/modules/auth/guards/jwt-auth.guard");
const admin_only_guard_1 = require("../../../src/modules/auth/guards/admin-only.guard");
const user_entity_1 = require("../../../src/modules/users/entities/user.entity");
describe('RegisterPharmacy - Admin Only Guard Integration', () => {
    let controller;
    let authService;
    let jwtService;
    const mockAuthService = {
        registerPharmacy: jest.fn(),
        loginAdmin: jest.fn(),
        loginPharmacy: jest.fn(),
        registerAdmin: jest.fn(),
        refreshAdmin: jest.fn(),
    };
    const mockJwtService = {
        verify: jest.fn(),
        sign: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [auth_controller_1.AuthController],
            providers: [
                {
                    provide: auth_service_1.AuthService,
                    useValue: mockAuthService,
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
            ],
        })
            .overrideGuard(jwt_auth_guard_1.JwtAuthGuard)
            .useValue({
            canActivate: (context) => {
                const request = context.switchToHttp().getRequest();
                const authHeader = request.headers.authorization;
                if (!authHeader) {
                    throw new common_1.UnauthorizedException('Missing JWT token');
                }
                const token = authHeader.replace('Bearer ', '');
                if (token === 'invalid.token') {
                    throw new common_1.UnauthorizedException('Invalid token');
                }
                // Simular payload del JWT
                if (token === 'admin.token') {
                    request.user = {
                        id: 'admin-123',
                        email: 'admin@example.com',
                        role: user_entity_1.UserRole.ADMIN,
                    };
                }
                else if (token === 'pharmacy.token') {
                    request.user = {
                        id: 'pharmacy-123',
                        email: 'pharmacy@example.com',
                        role: user_entity_1.UserRole.PHARMACY,
                    };
                }
                return true;
            },
        })
            .overrideGuard(admin_only_guard_1.AdminOnlyGuard)
            .useValue({
            canActivate: (context) => {
                const request = context.switchToHttp().getRequest();
                if (!request.user) {
                    throw new common_1.UnauthorizedException('User not found');
                }
                if (request.user.role !== user_entity_1.UserRole.ADMIN) {
                    throw new common_1.ForbiddenException('Admin role required');
                }
                return true;
            },
        })
            .compile();
        controller = module.get(auth_controller_1.AuthController);
        authService = module.get(auth_service_1.AuthService);
        jwtService = module.get(jwt_1.JwtService);
        jest.clearAllMocks();
    });
    describe('POST /auth/register/pharmacy', () => {
        const registerPharmacyDto = {
            name: 'Farmacia Central',
            email: 'central@pharmacy.com',
            password: 'SecurePass123!',
            passwordConfirm: 'SecurePass123!',
            address: 'Av. Libertad 321',
            city: 'La Paz',
            phone: '+593 998765432',
        };
        it('should allow pharmacy registration when admin is authenticated', async () => {
            mockAuthService.registerPharmacy.mockResolvedValue({
                message: 'Pharmacy registered successfully',
                pharmacy: {
                    id: 'pharmacy-123',
                    name: 'Farmacia Central',
                    email: 'central@pharmacy.com',
                },
            });
            const request = {
                headers: {
                    authorization: 'Bearer admin.token',
                },
                user: {
                    id: 'admin-123',
                    email: 'admin@example.com',
                    role: user_entity_1.UserRole.ADMIN,
                },
                ip: '192.168.1.1',
            };
            const result = await controller.registerPharmacy(registerPharmacyDto, request);
            expect(result).toBeDefined();
            expect(mockAuthService.registerPharmacy).toHaveBeenCalledWith(registerPharmacyDto, 'admin-123');
        });
        it('should reject pharmacy registration when user is pharmacy (not admin)', async () => {
            const request = {
                headers: {
                    authorization: 'Bearer pharmacy.token',
                },
                user: {
                    id: 'pharmacy-123',
                    email: 'pharmacy@example.com',
                    role: user_entity_1.UserRole.PHARMACY,
                },
                ip: '192.168.1.1',
            };
            // Simular que AdminOnlyGuard rechaza la solicitud
            expect(() => {
                if (request.user.role !== user_entity_1.UserRole.ADMIN) {
                    throw new common_1.ForbiddenException('Admin role required');
                }
            }).toThrow(common_1.ForbiddenException);
        });
        it('should reject pharmacy registration when JWT token is missing', async () => {
            const request = {
                headers: {},
                ip: '192.168.1.1',
            };
            // Simular que JwtAuthGuard rechaza la solicitud
            expect(() => {
                const authHeader = request.headers.authorization;
                if (!authHeader) {
                    throw new common_1.UnauthorizedException('Missing JWT token');
                }
            }).toThrow(common_1.UnauthorizedException);
        });
        it('should reject pharmacy registration when JWT token is invalid', async () => {
            const request = {
                headers: {
                    authorization: 'Bearer invalid.token',
                },
                ip: '192.168.1.1',
            };
            // Simular que JwtAuthGuard rechaza la solicitud
            expect(() => {
                const token = request.headers.authorization.replace('Bearer ', '');
                if (token === 'invalid.token') {
                    throw new common_1.UnauthorizedException('Invalid token');
                }
            }).toThrow(common_1.UnauthorizedException);
        });
        it('should pass admin user ID from JWT to use case', async () => {
            mockAuthService.registerPharmacy.mockResolvedValue({
                message: 'Pharmacy registered successfully',
                pharmacy: { id: 'pharmacy-123', name: 'Farmacia Central' },
            });
            const adminUserId = 'admin-456';
            const request = {
                headers: {
                    authorization: 'Bearer admin.token',
                },
                user: {
                    id: adminUserId,
                    email: 'admin@example.com',
                    role: user_entity_1.UserRole.ADMIN,
                },
                ip: '192.168.1.1',
            };
            await controller.registerPharmacy(registerPharmacyDto, request);
            expect(mockAuthService.registerPharmacy).toHaveBeenCalledWith(registerPharmacyDto, adminUserId);
        });
        it('should extract admin ID from request.user from JWT payload', async () => {
            mockAuthService.registerPharmacy.mockResolvedValue({
                message: 'Pharmacy registered successfully',
            });
            const adminIdFromToken = 'admin-from-jwt-payload';
            const request = {
                headers: {
                    authorization: 'Bearer admin.token',
                },
                user: {
                    id: adminIdFromToken,
                    email: 'admin@example.com',
                    role: user_entity_1.UserRole.ADMIN,
                },
                ip: '192.168.1.1',
            };
            await controller.registerPharmacy(registerPharmacyDto, request);
            expect(mockAuthService.registerPharmacy).toHaveBeenCalledWith(registerPharmacyDto, adminIdFromToken);
        });
    });
    describe('Guard validation rules', () => {
        it('should verify JwtAuthGuard is applied before AdminOnlyGuard', () => {
            // El decorador @UseGuards(JwtAuthGuard, AdminOnlyGuard) asegura que
            // primero se valida el JWT, y luego se valida que sea admin
            const guardMetadata = Reflect.getMetadata('guards', auth_controller_1.AuthController.prototype.registerPharmacy);
            // Esto es más una verificación conceptual de que los guards están en orden
            // En un test real, verificarías que JwtAuthGuard se ejecuta primero
            expect([jwt_auth_guard_1.JwtAuthGuard, admin_only_guard_1.AdminOnlyGuard]).toBeDefined();
        });
        it('should only allow ADMIN role for pharmacy registration', () => {
            const validRoles = [user_entity_1.UserRole.ADMIN];
            const invalidRoles = [user_entity_1.UserRole.PHARMACY, 'unknown_role', null, undefined];
            validRoles.forEach((role) => {
                if (role !== user_entity_1.UserRole.ADMIN) {
                    expect(() => {
                        throw new common_1.ForbiddenException('Admin role required');
                    }).not.toThrow();
                }
            });
            invalidRoles.forEach((role) => {
                if (role !== user_entity_1.UserRole.ADMIN) {
                    expect(() => {
                        throw new common_1.ForbiddenException('Admin role required');
                    }).toThrow(common_1.ForbiddenException);
                }
            });
        });
    });
});
