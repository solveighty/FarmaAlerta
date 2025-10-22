import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Medicine } from '../../medicines/entities/medicine.entity';

@Entity('alerts')
@Index(['user'])
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Alert unique identifier' })
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: 'User who created the alert' })
  user: User;

  @ManyToOne(() => Medicine)
  @JoinColumn({ name: 'medicine_id' })
  @ApiProperty({ description: 'Medicine to alert about' })
  medicine: Medicine;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  @ApiProperty({ description: 'Whether the alert is active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: 'Alert creation date' })
  createdAt: Date;
}
