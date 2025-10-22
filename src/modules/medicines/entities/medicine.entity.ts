import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('medicines')
@Index(['name'])
export class Medicine {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Medicine unique identifier' })
  id: string;

  @Column({ type: 'varchar', length: 120 })
  @ApiProperty({ description: 'Medicine name' })
  name: string;

  @Column({ type: 'varchar', length: 120, nullable: true, name: 'generic_name' })
  @ApiProperty({ description: 'Generic name', required: false })
  genericName?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Pharmaceutical presentation', required: false })
  presentation?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Laboratory manufacturer', required: false })
  laboratory?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Medicine description', required: false })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: 'Medicine creation date' })
  createdAt: Date;
}
