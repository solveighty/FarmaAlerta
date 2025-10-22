import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to FarmaAlerta API!';
  }

  getStatus() {
    return {
      status: 'ok',
      message: 'FarmaAlerta backend is running',
      timestamp: new Date().toISOString(),
    };
  }
}
