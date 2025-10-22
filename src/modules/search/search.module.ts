import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { MedicinesModule } from '../medicines/medicines.module';
import { PharmaciesModule } from '../pharmacies/pharmacies.module';

@Module({
  imports: [MedicinesModule, PharmaciesModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
