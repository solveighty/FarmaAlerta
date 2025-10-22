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
  USER = 'user',
  PHARMACY = 'pharmacy',
  ADMIN = 'admin',
}

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'User unique identifier' })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({ description: 'User full name' })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  @ApiProperty({ description: 'User email address' })
  email: string;

  @Column({ type: 'text', name: 'password_hash' })
  @ApiProperty({ description: 'User password (hashed)', writeOnly: true })
  passwordHash: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: UserRole.USER,
  })
  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  @ApiProperty({ description: 'Whether user is active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: 'User creation date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: 'User last update date' })
  updatedAt: Date;
}
