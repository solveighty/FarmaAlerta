import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterAdminUseCase } from './use-case/register-admin.use-case';
import { LoginAdminUseCase } from './use-case/login-admin.use-case';
import { RegisterPharmacyUseCase } from './use-case/register-pharmacy.use-case';
import { LoginPharmacyUseCase } from './use-case/login-pharmacy.use-case';
import { RefreshAdminUseCase } from './use-case/refresh-admin.use-case';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuditModule } from '../audit/audit.module';
import { PharmaciesModule } from '../pharmacies/pharmacies.module';
import { RedisModule } from '../../redis/redis.module';
import { envs } from '../../config';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: envs.JWT_SECRET,
      signOptions: { expiresIn: envs.JWT_EXPIRES_USER },
    }),
    UsersModule,
    AuditModule,
    PharmaciesModule,
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, RegisterAdminUseCase, LoginAdminUseCase, RegisterPharmacyUseCase, LoginPharmacyUseCase, RefreshAdminUseCase, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
