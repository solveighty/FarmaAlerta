import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMedicineDto } from './create-medicine.dto';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateMedicineDto extends PartialType(CreateMedicineDto) {
  @ApiProperty({ description: 'Medicine name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Reference price', required: false })
  @IsNumber()
  @IsOptional()
  referencePrice?: number;

  @ApiProperty({ description: 'Medicine description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
