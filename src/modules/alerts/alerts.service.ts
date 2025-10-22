import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertsService {
  create(alertData: any) {
    // TODO: Implementar lógica de creación de alerta
    return { message: 'Alerta creada' };
  }

  findAll(userId: string) {
    // TODO: Implementar lógica de búsqueda de alertas del usuario
    return { message: `Alertas del usuario ${userId}` };
  }

  remove(id: string) {
    // TODO: Implementar lógica de eliminación de alerta
    return { message: `Alerta ${id} eliminada` };
  }
}
