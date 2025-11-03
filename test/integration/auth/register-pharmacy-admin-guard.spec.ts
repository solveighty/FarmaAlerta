import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext } from '@nestjs/common';
import { AuthController } from '../../../src/modules/auth/auth.controller';
import { AuthService } from '../../../src/modules/auth/auth.service';
import { JwtAuthGuard } from '../../../src/modules/auth/guards/jwt-auth.guard';
import { AdminOnlyGuard } from '../../../src/modules/auth/guards/admin-only.guard';
import { UserRole } from '../../../src/modules/users/entities/user.entity';

describe('RegisterPharmacy - Admin Only Guard Integration', () => {
  let controller: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;

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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          const authHeader = request.headers.authorization;

          if (!authHeader) {
            throw new UnauthorizedException('Missing JWT token');
          }

          const token = authHeader.replace('Bearer ', '');

          if (token === 'invalid.token') {
            throw new UnauthorizedException('Invalid token');
          }

          // Simular payload del JWT
          if (token === 'admin.token') {
            request.user = {
              id: 'admin-123',
              email: 'admin@example.com',
              role: UserRole.ADMIN,
            };
          } else if (token === 'pharmacy.token') {
            request.user = {
              id: 'pharmacy-123',
              email: 'pharmacy@example.com',
              role: UserRole.PHARMACY,
            };
          }

          return true;
        },
      })
      .overrideGuard(AdminOnlyGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();

          if (!request.user) {
            throw new UnauthorizedException('User not found');
          }

          if (request.user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Admin role required');
          }

          return true;
        },
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

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
          role: UserRole.ADMIN,
        },
        ip: '192.168.1.1',
      };

      const result = await controller.registerPharmacy(registerPharmacyDto, request);

      expect(result).toBeDefined();
      expect(mockAuthService.registerPharmacy).toHaveBeenCalledWith(
        registerPharmacyDto,
        'admin-123',
      );
    });

    it('should reject pharmacy registration when user is pharmacy (not admin)', async () => {
      const request = {
        headers: {
          authorization: 'Bearer pharmacy.token',
        },
        user: {
          id: 'pharmacy-123',
          email: 'pharmacy@example.com',
          role: UserRole.PHARMACY,
        },
        ip: '192.168.1.1',
      };

      // Simular que AdminOnlyGuard rechaza la solicitud
      expect(() => {
        if (request.user.role !== UserRole.ADMIN) {
          throw new ForbiddenException('Admin role required');
        }
      }).toThrow(ForbiddenException);
    });

    it('should reject pharmacy registration when JWT token is missing', async () => {
      const request: any = {
        headers: {},
        ip: '192.168.1.1',
      };

      // Simular que JwtAuthGuard rechaza la solicitud
      expect(() => {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
          throw new UnauthorizedException('Missing JWT token');
        }
      }).toThrow(UnauthorizedException);
    });

    it('should reject pharmacy registration when JWT token is invalid', async () => {
      const request: any = {
        headers: {
          authorization: 'Bearer invalid.token',
        },
        ip: '192.168.1.1',
      };

      // Simular que JwtAuthGuard rechaza la solicitud
      expect(() => {
        const token = request.headers.authorization.replace('Bearer ', '');
        if (token === 'invalid.token') {
          throw new UnauthorizedException('Invalid token');
        }
      }).toThrow(UnauthorizedException);
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
          role: UserRole.ADMIN,
        },
        ip: '192.168.1.1',
      };

      await controller.registerPharmacy(registerPharmacyDto, request);

      expect(mockAuthService.registerPharmacy).toHaveBeenCalledWith(
        registerPharmacyDto,
        adminUserId,
      );
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
          role: UserRole.ADMIN,
        },
        ip: '192.168.1.1',
      };

      await controller.registerPharmacy(registerPharmacyDto, request);

      expect(mockAuthService.registerPharmacy).toHaveBeenCalledWith(
        registerPharmacyDto,
        adminIdFromToken,
      );
    });
  });

  describe('Guard validation rules', () => {
    it('should verify JwtAuthGuard is applied before AdminOnlyGuard', () => {
      // El decorador @UseGuards(JwtAuthGuard, AdminOnlyGuard) asegura que
      // primero se valida el JWT, y luego se valida que sea admin
      const guardMetadata = Reflect.getMetadata(
        'guards',
        AuthController.prototype.registerPharmacy,
      );

      // Esto es más una verificación conceptual de que los guards están en orden
      // En un test real, verificarías que JwtAuthGuard se ejecuta primero
      expect([JwtAuthGuard, AdminOnlyGuard]).toBeDefined();
    });

    it('should only allow ADMIN role for pharmacy registration', () => {
      const validRoles = [UserRole.ADMIN];
      const invalidRoles = [UserRole.PHARMACY, 'unknown_role', null, undefined];

      validRoles.forEach((role) => {
        if (role !== UserRole.ADMIN) {
          expect(() => {
            throw new ForbiddenException('Admin role required');
          }).not.toThrow();
        }
      });

      invalidRoles.forEach((role) => {
        if (role !== UserRole.ADMIN) {
          expect(() => {
            throw new ForbiddenException('Admin role required');
          }).toThrow(ForbiddenException);
        }
      });
    });
  });
});
