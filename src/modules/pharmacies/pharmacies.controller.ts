import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PharmaciesService } from './pharmacies.service';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';

@ApiTags('Pharmacies')
@Controller('pharmacies')
export class PharmaciesController {
  constructor(private readonly pharmaciesService: PharmaciesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pharmacy' })
  @ApiResponse({ status: 201, description: 'Pharmacy successfully created' })
  async create(@Body() createPharmacyDto: CreatePharmacyDto) {
    return this.pharmaciesService.create(createPharmacyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pharmacies' })
  @ApiResponse({ status: 200, description: 'Returns all pharmacies' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.pharmaciesService.findAll(page, limit);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search pharmacies' })
  @ApiResponse({ status: 200, description: 'Search results' })
  async search(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.pharmaciesService.search(query, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pharmacy by ID' })
  @ApiResponse({ status: 200, description: 'Returns a specific pharmacy' })
  async findOne(@Param('id') id: string) {
    return this.pharmaciesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update pharmacy' })
  @ApiResponse({ status: 200, description: 'Pharmacy successfully updated' })
  async update(
    @Param('id') id: string,
    @Body() updatePharmacyDto: UpdatePharmacyDto,
  ) {
    return this.pharmaciesService.update(id, updatePharmacyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete pharmacy' })
  @ApiResponse({ status: 200, description: 'Pharmacy successfully deleted' })
  async remove(@Param('id') id: string) {
    await this.pharmaciesService.remove(id);
    return { message: 'Pharmacy successfully deleted' };
  }
}
