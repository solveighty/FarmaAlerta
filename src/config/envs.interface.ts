export interface IEnvs {
  NODE_ENV: string;
  APP_PORT: number;
  APP_HOST: string;
  APP_URL: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  REDIS_DB: number;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  SWAGGER_ENABLED: boolean;
  SWAGGER_PATH: string;
  LOG_LEVEL: string;
  LOG_FILE: string;
  CORS_ORIGIN: string;
}
