import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Match } from '../../../common/decorators/match.decorator';

export class RegisterAdminDto {
  @ApiProperty({
    description: 'Admin full name',
    example: 'Admin User',
    minLength: 3,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@example.com',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'Admin password (minimum 8 characters)',
    example: 'SecureAdminPassword123!',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    description: 'Password confirmation must match password field',
    example: 'SecureAdminPassword123!',
  })
  @IsNotEmpty({ message: 'Password confirmation is required' })
  @IsString({ message: 'Password confirmation must be a string' })
  @Match('password', {
    message: 'Password confirmation must match password',
  })
  passwordConfirm: string;

  @ApiProperty({
    description: 'Master key for admin registration (must match MASTER_KEY env var)',
    example: 'your-secure-master-key',
  })
  @IsNotEmpty({ message: 'Master key is required' })
  @IsString({ message: 'Master key must be a string' })
  masterKey: string;
}
