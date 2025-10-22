import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Medicine } from './entities/medicine.entity';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,
  ) {}

  async create(createMedicineDto: CreateMedicineDto): Promise<Medicine> {
    const existingMedicine = await this.medicineRepository.findOne({
      where: { name: createMedicineDto.name },
    });

    if (existingMedicine) {
      throw new BadRequestException('Medicine with this name already exists');
    }

    const medicine = this.medicineRepository.create(createMedicineDto);
    return this.medicineRepository.save(medicine);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [medicines, total] = await this.medicineRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: medicines,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Medicine> {
    const medicine = await this.medicineRepository.findOne({
      where: { id },
    });

    if (!medicine) {
      throw new NotFoundException(`Medicine with ID ${id} not found`);
    }

    return medicine;
  }

  async search(query: string, page: number = 1, limit: number = 10) {
    const [medicines, total] = await this.medicineRepository.findAndCount({
      where: [
        { name: Like(`%${query}%`) },
        { genericName: Like(`%${query}%`) },
      ],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: medicines,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    id: string,
    updateMedicineDto: UpdateMedicineDto,
  ): Promise<Medicine> {
    const medicine = await this.findOne(id);

    Object.assign(medicine, updateMedicineDto);

    return this.medicineRepository.save(medicine);
  }

  async remove(id: string): Promise<void> {
    const result = await this.medicineRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Medicine with ID ${id} not found`);
    }
  }
}
