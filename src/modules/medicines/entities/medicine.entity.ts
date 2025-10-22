import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('medicines')
@Index(['name'])
@Index(['barcode'], { unique: true })
export class Medicine {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Medicine unique identifier' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: 'Medicine name' })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  @ApiProperty({ description: 'Medicine barcode' })
  barcode: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Medicine description', required: false })
  description?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Active ingredient', required: false })
  activeIngredient?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Pharmaceutical form (tablet, capsule, etc)', required: false })
  form?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Medicine strength/dosage', required: false })
  strength?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Manufacturer name', required: false })
  manufacturer?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: 'Reference price for the medicine' })
  referencePrice: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'ATC classification code', required: false })
  atcCode?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Indications for the medicine', required: false })
  indications?: string;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Whether medicine is available' })
  isAvailable: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: 'Medicine creation date' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Medicine last update date' })
  updatedAt: Date;
}
