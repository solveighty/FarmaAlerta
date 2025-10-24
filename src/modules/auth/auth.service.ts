import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserUseCase } from './use-case/register-user.use-case';
import { RegisterAdminUseCase } from './use-case/register-admin.use-case';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly registerAdminUseCase: RegisterAdminUseCase,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // TODO: Implement user validation
    // This should verify the email and password against the database
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(registerUserDto: RegisterUserDto): Promise<any> {
    return this.registerUserUseCase.execute(registerUserDto);
  }

  async registerAdmin(registerAdminDto: RegisterAdminDto): Promise<any> {
    return this.registerAdminUseCase.execute(registerAdminDto);
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
