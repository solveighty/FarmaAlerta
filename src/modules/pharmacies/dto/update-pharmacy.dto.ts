import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePharmacyDto } from './create-pharmacy.dto';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdatePharmacyDto extends PartialType(CreatePharmacyDto) {
  @ApiProperty({ description: 'Pharmacy name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Pharmacy address', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'Pharmacy phone number', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Pharmacy city', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'Pharmacy opening hours (JSONB)', required: false })
  @IsOptional()
  openingHours?: Record<string, any>;
}
