import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get API welcome message' })
  @ApiResponse({
    status: 200,
    description: 'Returns a welcome message',
    schema: {
      example: 'Welcome to FarmaAlerta API!',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('status')
  @ApiOperation({ summary: 'Get API status' })
  @ApiResponse({
    status: 200,
    description: 'Returns API status information',
    schema: {
      example: {
        status: 'ok',
        message: 'FarmaAlerta backend is running',
        timestamp: new Date().toISOString(),
      },
    },
  })
  getStatus() {
    return this.appService.getStatus();
  }
}
