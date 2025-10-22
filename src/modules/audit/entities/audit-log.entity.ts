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

@Entity('audit_log')
@Index(['user'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Audit log unique identifier' })
  id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: 'User who performed the action', required: false })
  user?: User;

  @Column({ type: 'varchar', length: 150 })
  @ApiProperty({ description: 'Action performed' })
  action: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({ description: 'Entity type (users, medicines, pharmacies, etc)' })
  entity: string;

  @Column({ type: 'uuid', nullable: true, name: 'entity_id' })
  @ApiProperty({ description: 'Entity identifier', required: false })
  entityId?: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Action timestamp' })
  timestamp: Date;

  @Column({ type: 'varchar', length: 45, nullable: true, name: 'ip_address' })
  @ApiProperty({ description: 'IP address of the request', required: false })
  ipAddress?: string;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: 'Additional details in JSON format', required: false })
  details?: Record<string, any>;
}
