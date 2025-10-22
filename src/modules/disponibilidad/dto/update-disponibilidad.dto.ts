import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsOptional, IsBoolean } from 'class-validator';

export class UpdateDisponibilidadDto {
  @ApiProperty({ description: 'Cantidad disponible', required: false })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  quantity?: number;

  @ApiProperty({ description: 'Precio unitario', required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ description: 'Estado disponible (true/false)', required: false })
  @IsBoolean()
  @IsOptional()
  inStock?: boolean;
}
