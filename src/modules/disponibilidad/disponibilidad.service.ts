import { Injectable } from '@nestjs/common';
import { CreateDisponibilidadDto } from './dto/create-disponibilidad.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';

@Injectable()
export class DisponibilidadService {
  create(createDisponibilidadDto: CreateDisponibilidadDto) {
    // TODO: Implementar lógica de creación
    return { message: 'Disponibilidad creada' };
  }

  findAll(page: number, limit: number) {
    // TODO: Implementar lógica de búsqueda
    return { message: 'Lista de disponibilidades' };
  }

  findByPharmacy(pharmacyId: string) {
    // TODO: Implementar lógica de búsqueda por farmacia
    return { message: `Disponibilidades de la farmacia ${pharmacyId}` };
  }

  findByMedicine(medicineId: string) {
    // TODO: Implementar lógica de búsqueda por medicamento
    return { message: `Farmacias con el medicamento ${medicineId}` };
  }

  update(id: string, updateDisponibilidadDto: UpdateDisponibilidadDto) {
    // TODO: Implementar lógica de actualización
    return { message: `Disponibilidad ${id} actualizada` };
  }

  remove(id: string) {
    // TODO: Implementar lógica de eliminación
    return { message: `Disponibilidad ${id} eliminada` };
  }
}
