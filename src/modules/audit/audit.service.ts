import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

export interface CreateAuditLogDto {
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  ipAddress?: string;
  details?: Record<string, any>;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async create(auditData: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditRepository.create({
      action: auditData.action,
      entity: auditData.entity,
      entityId: auditData.entityId,
      user: auditData.userId ? { id: auditData.userId } : undefined,
      ipAddress: auditData.ipAddress,
      details: auditData.details,
    });

    return this.auditRepository.save(auditLog);
  }

  findAll(page: number, limit: number) {
    // TODO: Implementar lógica de búsqueda de todos los logs
    return { message: 'Lista de logs de auditoría' };
  }

  findByUser(userId: string) {
    // TODO: Implementar lógica de búsqueda de logs por usuario
    return { message: `Logs del usuario ${userId}` };
  }
}
