import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class CreateDisponibilidadDto {
  @ApiProperty({ description: 'ID de la farmacia' })
  @IsString()
  pharmacyId: string;

  @ApiProperty({ description: 'ID del medicamento' })
  @IsString()
  medicineId: string;

  @ApiProperty({ description: 'Cantidad disponible' })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ description: 'Precio unitario', required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ description: 'Estado disponible (true/false)', required: false })
  @IsOptional()
  inStock?: boolean;
}
