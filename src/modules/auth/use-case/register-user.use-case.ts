import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UsersService } from '../../users/users.service';
import { AuditService } from '../../audit/audit.service';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly auditService: AuditService,
  ) {}

  async execute(registerUserDto: RegisterUserDto): Promise<{ message: string; user: any }> {
    // Validate that passwords match
    if (registerUserDto.password !== registerUserDto.passwordConfirm) {
      throw new BadRequestException('Passwords do not match');
    }

    // Validate password length
    if (registerUserDto.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    // Check if user with this email already exists
    const existingUser = await this.usersService.findByEmail(registerUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      // Create the user with role = USER
      const newUser = await this.usersService.create({
        name: registerUserDto.name,
        email: registerUserDto.email,
        password: registerUserDto.password,
        role: UserRole.USER,
      });

      // Register action in audit log
      await this.auditService.create({
        action: 'USER_REGISTER',
        entity: 'users',
        entityId: newUser.id,
        userId: newUser.id,
        details: {
          email: newUser.email,
          name: newUser.name,
        },
      });

      // Return confirmation without tokens
      return {
        message: 'User registered successfully. Please log in to access the application.',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          isActive: newUser.isActive,
          createdAt: newUser.createdAt,
        },
      };
    } catch (error) {
      // If the error is already a BadRequestException or ConflictException, re-throw it
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }

      // Otherwise, throw a generic error
      throw new BadRequestException('An error occurred while registering the user');
    }
  }
}
