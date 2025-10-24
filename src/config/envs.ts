import 'dotenv/config';
import { get } from 'env-var';
import { IEnvs } from './envs.interface';

export const envs: IEnvs = {
  // Environment and Port
  NODE_ENV: get('NODE_ENV').required().asString(),
  APP_PORT: get('APP_PORT').required().asPortNumber(),
  APP_HOST: get('APP_HOST').required().asString(),
  APP_URL: get('APP_URL').required().asString(),

  // Database PostgreSQL
  DB_HOST: get('DB_HOST').required().asString(),
  DB_PORT: get('DB_PORT').required().asPortNumber(),
  DB_USERNAME: get('DB_USERNAME').required().asString(),
  DB_PASSWORD: get('DB_PASSWORD').required().asString(),
  DB_DATABASE: get('DB_DATABASE').required().asString(),

  // Redis
  REDIS_HOST: get('REDIS_HOST').required().asString(),
  REDIS_PORT: get('REDIS_PORT').required().asPortNumber(),
  REDIS_PASSWORD: get('REDIS_PASSWORD').asString(),
  REDIS_DB: get('REDIS_DB').default('0').asInt(),

  // JWT Authentication
  JWT_SECRET: get('JWT_SECRET').required().asString(),
  JWT_EXPIRES_ADMIN: get('JWT_EXPIRES_ADMIN').required().asString(),
  JWT_EXPIRES_PHARMACY: get('JWT_EXPIRES_PHARMACY').required().asString(),
  JWT_EXPIRES_USER: get('JWT_EXPIRES_USER').required().asString(),
  JWT_REFRESH_EXPIRES_ADMIN: get('JWT_REFRESH_EXPIRES_ADMIN').required().asString(),
  JWT_REFRESH_EXPIRES_PHARMACY: get('JWT_REFRESH_EXPIRES_PHARMACY').required().asString(),
  JWT_REFRESH_EXPIRES_USER: get('JWT_REFRESH_EXPIRES_USER').required().asString(),
  MASTER_KEY: get('MASTER_KEY').required().asString(),

  // Swagger Documentation
  SWAGGER_ENABLED: get('SWAGGER_ENABLED').default('true').asBool(),
  SWAGGER_PATH: get('SWAGGER_PATH').default('api/docs').asString(),

  // Logging
  LOG_LEVEL: get('LOG_LEVEL').default('debug').asString(),
  LOG_FILE: get('LOG_FILE').default('logs/application.log').asString(),

  // CORS
  CORS_ORIGIN: get('CORS_ORIGIN').default('*').asString(),
};
