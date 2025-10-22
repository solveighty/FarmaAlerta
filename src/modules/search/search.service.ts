import { Injectable } from '@nestjs/common';
import { MedicinesService } from '../medicines/medicines.service';
import { PharmaciesService } from '../pharmacies/pharmacies.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly medicinesService: MedicinesService,
    private readonly pharmaciesService: PharmaciesService,
  ) {}

  async search(query: string, page: number = 1, limit: number = 10) {
    const [medicines, pharmacies] = await Promise.all([
      this.medicinesService.search(query, page, limit),
      this.pharmaciesService.search(query, page, limit),
    ]);

    return {
      medicines,
      pharmacies,
      totalResults: medicines.total + pharmacies.total,
    };
  }

  async searchMedicines(query: string, page: number = 1, limit: number = 10) {
    return this.medicinesService.search(query, page, limit);
  }

  async searchPharmacies(query: string, page: number = 1, limit: number = 10) {
    return this.pharmaciesService.search(query, page, limit);
  }
}
