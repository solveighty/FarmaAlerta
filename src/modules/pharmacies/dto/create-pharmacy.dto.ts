import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class CreatePharmacyDto {
  @ApiProperty({ description: 'User ID (pharmacy owner)', required: false })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({ description: 'Pharmacy name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Pharmacy email', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Pharmacy phone number', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Pharmacy address' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Pharmacy city', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'Pharmacy latitude', required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: 'Pharmacy longitude', required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ description: 'Pharmacy postal code', required: false })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ description: 'Pharmacy registration number', required: false })
  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @ApiProperty({ description: 'Pharmacy opening hours (JSONB)', required: false })
  @IsOptional()
  openingHours?: Record<string, any>;
}

