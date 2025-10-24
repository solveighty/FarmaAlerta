import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { envs } from '../config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);

  async onModuleInit() {
    const url = this.buildUrl();
    this.client = createClient({ url });

    this.client.on('error', (err) => this.logger.error('Redis Client Error', err));

    await this.client.connect();
    this.logger.log('Connected to Redis');
  }

  async onModuleDestroy() {
    try {
      await this.client.disconnect();
      this.logger.log('Disconnected from Redis');
    } catch (err) {
      this.logger.error('Error disconnecting Redis', err);
    }
  }

  private buildUrl() {
    // Build Redis connection URL using host/port and optional password
    const pass = envs.REDIS_PASSWORD;
    const host = envs.REDIS_HOST;
    const port = envs.REDIS_PORT;

    if (pass) {
      return `redis://:${encodeURIComponent(pass)}@${host}:${port}`;
    }

    return `redis://${host}:${port}`;
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.client.set(key, value, { EX: ttlSeconds });
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }
}
