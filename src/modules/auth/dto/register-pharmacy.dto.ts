import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsOptional,
  Matches,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Match } from '../../../common/decorators/match.decorator';

export class RegisterPharmacyDto {
  @ApiProperty({
    description: 'Pharmacy name',
    example: 'Farmacia Central',
    minLength: 3,
    maxLength: 120,
  })
  @IsNotEmpty({ message: 'Pharmacy name is required' })
  @IsString({ message: 'Pharmacy name must be a string' })
  @MinLength(3, { message: 'Pharmacy name must be at least 3 characters long' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    description: 'Pharmacy email address',
    example: 'farmacia@example.com',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'Pharmacy password (minimum 8 characters)',
    example: 'SecurePass123!',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    description: 'Password confirmation must match password',
    example: 'SecurePass123!',
  })
  @IsNotEmpty({ message: 'Password confirmation is required' })
  @IsString({ message: 'Password confirmation must be a string' })
  @Match('password', {
    message: 'Password confirmation must match password',
  })
  passwordConfirm: string;

  @ApiProperty({
    description: 'Pharmacy address',
    example: 'Av. Libertad 321, Zona Centro',
    minLength: 5,
    maxLength: 200,
  })
  @IsNotEmpty({ message: 'Address is required' })
  @IsString({ message: 'Address must be a string' })
  @MinLength(5, { message: 'Address must be at least 5 characters long' })
  @Transform(({ value }) => value?.trim())
  address: string;

  @ApiProperty({
    description: 'Pharmacy phone number (format: +country_code digits or local format)',
    example: '+593 998765432',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Matches(/^(\+\d{1,3}[\s.-]?)?\d{6,}$/, {
    message: 'Invalid phone number format. Use +country_code format or local number with at least 6 digits',
  })
  phone?: string;

  @ApiProperty({
    description: 'Pharmacy city',
    example: 'La Paz',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'City must be a string' })
  @MinLength(2, { message: 'City must be at least 2 characters long' })
  @Transform(({ value }) => value?.trim())
  city?: string;

  @ApiProperty({
    description: 'Pharmacy latitude coordinate',
    example: -16.5,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Latitude must be a number' })
  latitude?: number;

  @ApiProperty({
    description: 'Pharmacy longitude coordinate',
    example: -68.15,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Longitude must be a number' })
  longitude?: number;

  @ApiProperty({
    description: 'Pharmacy opening hours (JSONB format)',
    example: { open: '08:00', close: '22:00' },
    required: false,
  })
  @IsOptional()
  openingHours?: Record<string, any>;
}
