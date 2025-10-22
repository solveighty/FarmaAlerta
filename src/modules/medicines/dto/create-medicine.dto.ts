import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateMedicineDto {
  @ApiProperty({ description: 'Medicine name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Medicine barcode' })
  @IsString()
  barcode: string;

  @ApiProperty({ description: 'Medicine description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Active ingredient', required: false })
  @IsString()
  @IsOptional()
  activeIngredient?: string;

  @ApiProperty({ description: 'Pharmaceutical form', required: false })
  @IsString()
  @IsOptional()
  form?: string;

  @ApiProperty({ description: 'Medicine strength/dosage', required: false })
  @IsString()
  @IsOptional()
  strength?: string;

  @ApiProperty({ description: 'Manufacturer name', required: false })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({ description: 'Reference price' })
  @IsNumber()
  @IsPositive()
  referencePrice: number;

  @ApiProperty({ description: 'ATC classification code', required: false })
  @IsString()
  @IsOptional()
  atcCode?: string;

  @ApiProperty({ description: 'Medicine indications', required: false })
  @IsString()
  @IsOptional()
  indications?: string;
}
