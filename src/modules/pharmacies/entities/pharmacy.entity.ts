import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('pharmacies')
@Index(['name'])
@Index(['email'], { unique: true })
export class Pharmacy {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Pharmacy unique identifier' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: 'Pharmacy name' })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @ApiProperty({ description: 'Pharmacy email' })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'Pharmacy phone number', required: false })
  phone?: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: 'Pharmacy address' })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'Pharmacy postal code', required: false })
  postalCode?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Pharmacy city', required: false })
  city?: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  @ApiProperty({ description: 'Pharmacy latitude coordinate', required: false })
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  @ApiProperty({ description: 'Pharmacy longitude coordinate', required: false })
  longitude?: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Pharmacy registration number', required: false })
  registrationNumber?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Pharmacy opening hours', required: false })
  openingHours?: string;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Whether pharmacy is active' })
  isActive: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: 'Pharmacy creation date' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Pharmacy last update date' })
  updatedAt: Date;
}
