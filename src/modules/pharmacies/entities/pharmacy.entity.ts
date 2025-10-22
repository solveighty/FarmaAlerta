import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('pharmacies')
@Index(['city'])
export class Pharmacy {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Pharmacy unique identifier' })
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: 'User managing the pharmacy' })
  user: User;

  @Column({ type: 'varchar', length: 120 })
  @ApiProperty({ description: 'Pharmacy name' })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  @ApiProperty({ description: 'Pharmacy address', required: false })
  address?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Pharmacy city', required: false })
  city?: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  @ApiProperty({ description: 'Pharmacy latitude coordinate', required: false })
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  @ApiProperty({ description: 'Pharmacy longitude coordinate', required: false })
  longitude?: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'Pharmacy phone number', required: false })
  phone?: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: 'Pharmacy creation date' })
  createdAt: Date;
}
