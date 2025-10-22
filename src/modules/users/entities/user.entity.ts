import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  PATIENT = 'patient',
  PHARMACY_ADMIN = 'pharmacy_admin',
  SYSTEM_ADMIN = 'system_admin',
}

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'User unique identifier' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: 'User full name' })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @ApiProperty({ description: 'User email address' })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: 'User password (hashed)', writeOnly: true })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  role: UserRole;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'User phone number', required: false })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'User address', required: false })
  address?: string;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Whether user is active' })
  isActive: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: 'User creation date' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'User last update date' })
  updatedAt: Date;
}
