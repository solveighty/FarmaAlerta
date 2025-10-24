import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { RegisterPharmacyDto } from '../dto/register-pharmacy.dto';
import { UsersService } from '../../users/users.service';
import { PharmaciesService } from '../../pharmacies/pharmacies.service';
import { AuditService } from '../../audit/audit.service';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RegisterPharmacyUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly pharmaciesService: PharmaciesService,
    private readonly auditService: AuditService,
  ) {}

  async execute(
    registerPharmacyDto: RegisterPharmacyDto,
    adminUserId: string,
  ): Promise<{ message: string; pharmacy: any }> {
    // Validate that passwords match
    if (registerPharmacyDto.password !== registerPharmacyDto.passwordConfirm) {
      throw new BadRequestException('Passwords do not match');
    }

    // Validate password length
    if (registerPharmacyDto.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    // Check if user with this email already exists
    const existingUser = await this.usersService.findByEmail(registerPharmacyDto.email);
    if (existingUser) {
      await this.auditService.create({
        action: 'ADMIN_CREATE_PHARMACY_FAILED',
        entity: 'pharmacies',
        userId: adminUserId,
        details: {
          reason: 'Email already exists',
          email: registerPharmacyDto.email,
        },
      });
      throw new ConflictException('Pharmacy with this email already exists');
    }

    try {
      // Create the user with role = PHARMACY
      const newUser = await this.usersService.create({
        name: registerPharmacyDto.name,
        email: registerPharmacyDto.email,
        password: registerPharmacyDto.password,
        role: UserRole.PHARMACY,
        phone: registerPharmacyDto.phone,
      });

      // Create the pharmacy record linked to the user
      const newPharmacy = await this.pharmaciesService.create({
        userId: newUser.id,
        name: registerPharmacyDto.name,
        address: registerPharmacyDto.address,
        city: registerPharmacyDto.city,
        latitude: registerPharmacyDto.latitude,
        longitude: registerPharmacyDto.longitude,
        phone: registerPharmacyDto.phone,
        openingHours: registerPharmacyDto.openingHours || undefined,
      } as any);

      // Register action in audit log
      await this.auditService.create({
        action: 'ADMIN_CREATE_PHARMACY',
        entity: 'pharmacies',
        entityId: newPharmacy.id,
        userId: adminUserId,
        details: {
          pharmacyId: newPharmacy.id,
          pharmacyName: newPharmacy.name,
          email: newUser.email,
        },
      });

      // Return confirmation without tokens
      return {
        message: 'Pharmacy registered successfully. Please log in to access the application.',
        pharmacy: {
          id: newPharmacy.id,
          userId: newUser.id,
          name: newPharmacy.name,
          email: newUser.email,
          address: newPharmacy.address,
          phone: newPharmacy.phone,
          openingHours: newPharmacy.openingHours,
          isActive: newUser.isActive,
          createdAt: newPharmacy.createdAt,
        },
      };
    } catch (error) {
      // Log failed attempt
      await this.auditService.create({
        action: 'ADMIN_CREATE_PHARMACY_FAILED',
        entity: 'pharmacies',
        userId: adminUserId,
        details: {
          reason: error instanceof Error ? error.message : 'Unknown error',
          email: registerPharmacyDto.email,
        },
      });

      // If the error is already a BadRequestException or ConflictException, re-throw it
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }

      // Otherwise, throw a generic error
      throw new BadRequestException('An error occurred while registering the pharmacy');
    }
  }
}
