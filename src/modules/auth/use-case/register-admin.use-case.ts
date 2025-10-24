import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterAdminDto } from '../dto/register-admin.dto';
import { UsersService } from '../../users/users.service';
import { AuditService } from '../../audit/audit.service';
import { UserRole } from '../../users/entities/user.entity';
import { envs } from '../../../config';

@Injectable()
export class RegisterAdminUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly auditService: AuditService,
  ) {}

  async execute(registerAdminDto: RegisterAdminDto): Promise<{ message: string; user: any }> {
    // Validate master key
    if (registerAdminDto.masterKey !== envs.MASTER_KEY) {
      throw new UnauthorizedException(
        'Invalid master key. Admin registration is not authorized.',
      );
    }

    // Validate that passwords match
    if (registerAdminDto.password !== registerAdminDto.passwordConfirm) {
      throw new BadRequestException('Passwords do not match');
    }

    // Validate password length
    if (registerAdminDto.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    // Check if user with this email already exists
    const existingUser = await this.usersService.findByEmail(registerAdminDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    try {
      // Create the admin user with role = ADMIN
      const newAdmin = await this.usersService.create({
        name: registerAdminDto.name,
        email: registerAdminDto.email,
        password: registerAdminDto.password,
        role: UserRole.ADMIN,
      });

      // Register action in audit log
      await this.auditService.create({
        action: 'ADMIN_REGISTER',
        entity: 'users',
        entityId: newAdmin.id,
        userId: newAdmin.id,
        details: {
          email: newAdmin.email,
          name: newAdmin.name,
          role: newAdmin.role,
        },
      });

      // Return confirmation without tokens
      return {
        message: 'Admin account created successfully. Please log in to access the application.',
        user: {
          id: newAdmin.id,
          email: newAdmin.email,
          name: newAdmin.name,
          role: newAdmin.role,
          isActive: newAdmin.isActive,
          createdAt: newAdmin.createdAt,
        },
      };
    } catch (error) {
      // If the error is already a BadRequestException, re-throw it
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Otherwise, throw a generic error
      throw new BadRequestException('An error occurred while registering the admin');
    }
  }
}
