import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { envs } from './envs';
import { User } from '../modules/users/entities/user.entity';
import { Pharmacy } from '../modules/pharmacies/entities/pharmacy.entity';
import { Medicine } from '../modules/medicines/entities/medicine.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: envs.DB_HOST,
      port: envs.DB_PORT,
      username: envs.DB_USERNAME,
      password: envs.DB_PASSWORD,
      database: envs.DB_DATABASE,
      entities: [User, Pharmacy, Medicine],
      synchronize: envs.NODE_ENV !== 'production',
      logging: envs.NODE_ENV === 'development',
      ssl:
        envs.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    };
  }
}
