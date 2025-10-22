import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Pharmacy } from './entities/pharmacy.entity';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';

@Injectable()
export class PharmaciesService {
  constructor(
    @InjectRepository(Pharmacy)
    private readonly pharmacyRepository: Repository<Pharmacy>,
  ) {}

  async create(createPharmacyDto: CreatePharmacyDto): Promise<Pharmacy> {
    const existingPharmacy = await this.pharmacyRepository.findOne({
      where: { name: createPharmacyDto.name },
    });

    if (existingPharmacy) {
      throw new BadRequestException(
        'Pharmacy with this name already exists',
      );
    }

    const pharmacy = this.pharmacyRepository.create(createPharmacyDto);
    return this.pharmacyRepository.save(pharmacy);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [pharmacies, total] = await this.pharmacyRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: pharmacies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Pharmacy> {
    const pharmacy = await this.pharmacyRepository.findOne({
      where: { id },
    });

    if (!pharmacy) {
      throw new NotFoundException(`Pharmacy with ID ${id} not found`);
    }

    return pharmacy;
  }

  async search(query: string, page: number = 1, limit: number = 10) {
    const [pharmacies, total] = await this.pharmacyRepository.findAndCount({
      where: [
        { name: Like(`%${query}%`) },
        { city: Like(`%${query}%`) },
        { address: Like(`%${query}%`) },
      ],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: pharmacies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    id: string,
    updatePharmacyDto: UpdatePharmacyDto,
  ): Promise<Pharmacy> {
    const pharmacy = await this.findOne(id);

    Object.assign(pharmacy, updatePharmacyDto);

    return this.pharmacyRepository.save(pharmacy);
  }

  async remove(id: string): Promise<void> {
    const result = await this.pharmacyRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Pharmacy with ID ${id} not found`);
    }
  }
}
