import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Pharmacy } from '../../pharmacies/entities/pharmacy.entity';
import { Medicine } from '../../medicines/entities/medicine.entity';

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  OUT_OF_STOCK = 'out_of_stock',
}

@Entity('availability')
@Index(['status'])
@Unique(['pharmacy', 'medicine'])
export class Availability {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Availability unique identifier' })
  id: string;

  @ManyToOne(() => Pharmacy)
  @JoinColumn({ name: 'pharmacy_id' })
  @ApiProperty({ description: 'Pharmacy reference' })
  pharmacy: Pharmacy;

  @ManyToOne(() => Medicine)
  @JoinColumn({ name: 'medicine_id' })
  @ApiProperty({ description: 'Medicine reference' })
  medicine: Medicine;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty({ description: 'Medicine price at this pharmacy' })
  price: number;

  @Column({ type: 'integer', default: 0 })
  @ApiProperty({ description: 'Stock quantity' })
  stock: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: AvailabilityStatus.AVAILABLE,
  })
  @ApiProperty({
    description: 'Availability status',
    enum: AvailabilityStatus,
  })
  status: AvailabilityStatus;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}
