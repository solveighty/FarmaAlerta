import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserUseCase } from './use-case/register-user.use-case';
import { RegisterAdminUseCase } from './use-case/register-admin.use-case';
import { LoginUserUseCase } from './use-case/login-user.use-case';
import { LoginAdminUseCase } from './use-case/login-admin.use-case';
import { RegisterPharmacyUseCase } from './use-case/register-pharmacy.use-case';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RegisterPharmacyDto } from './dto/register-pharmacy.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly registerAdminUseCase: RegisterAdminUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly loginAdminUseCase: LoginAdminUseCase,
    private readonly registerPharmacyUseCase: RegisterPharmacyUseCase,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // TODO: Implement user validation
    // This should verify the email and password against the database
    return null;
  }

  async register(registerUserDto: RegisterUserDto): Promise<any> {
    return this.registerUserUseCase.execute(registerUserDto);
  }

  async registerAdmin(registerAdminDto: RegisterAdminDto): Promise<any> {
    return this.registerAdminUseCase.execute(registerAdminDto);
  }

  async loginUser(email: string, password: string): Promise<any> {
    return this.loginUserUseCase.execute(email, password);
  }

  async loginAdmin(email: string, password: string): Promise<any> {
    return this.loginAdminUseCase.execute(email, password);
  }

  async registerPharmacy(
    registerPharmacyDto: RegisterPharmacyDto,
    adminUserId: string,
  ): Promise<any> {
    return this.registerPharmacyUseCase.execute(registerPharmacyDto, adminUserId);
  }

  async generateToken(payload: any) {
    return this.jwtService.sign(payload);
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}
