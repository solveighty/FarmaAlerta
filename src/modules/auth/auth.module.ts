import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserUseCase } from './use-case/register-user.use-case';
import { RegisterAdminUseCase } from './use-case/register-admin.use-case';
import { LoginUserUseCase } from './use-case/login-user.use-case';
import { LoginAdminUseCase } from './use-case/login-admin.use-case';
import { UsersModule } from '../users/users.module';
import { AuditModule } from '../audit/audit.module';
import { RedisModule } from '../../redis/redis.module';
import { envs } from '../../config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: envs.JWT_SECRET,
      signOptions: { expiresIn: envs.JWT_EXPIRES_USER },
    }),
    UsersModule,
    AuditModule,
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, RegisterUserUseCase, RegisterAdminUseCase, LoginUserUseCase, LoginAdminUseCase],
  exports: [AuthService],
})
export class AuthModule {}
