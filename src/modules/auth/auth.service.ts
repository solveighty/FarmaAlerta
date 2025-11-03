import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterAdminUseCase } from './use-case/register-admin.use-case';
import { LoginAdminUseCase } from './use-case/login-admin.use-case';
import { RegisterPharmacyUseCase } from './use-case/register-pharmacy.use-case';
import { LoginPharmacyUseCase } from './use-case/login-pharmacy.use-case';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RegisterPharmacyDto } from './dto/register-pharmacy.dto';
import { LoginPharmacyDto } from './dto/login-pharmacy.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly registerAdminUseCase: RegisterAdminUseCase,
    private readonly loginAdminUseCase: LoginAdminUseCase,
    private readonly registerPharmacyUseCase: RegisterPharmacyUseCase,
    private readonly loginPharmacyUseCase: LoginPharmacyUseCase,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // TODO: Implement user validation
    // This should verify the email and password against the database
    return null;
  }

  async registerAdmin(registerAdminDto: RegisterAdminDto): Promise<any> {
    return this.registerAdminUseCase.execute(registerAdminDto);
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

  async loginPharmacy(loginPharmacyDto: LoginPharmacyDto, ipAddress: string): Promise<any> {
    return this.loginPharmacyUseCase.execute(loginPharmacyDto, ipAddress);
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
