import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { envs } from './config';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  // Global middleware
  app.use(compression());
  app.use(cors({ origin: envs.CORS_ORIGIN.split(',') }));
  app.use(helmet());

  // Global pipes
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('FarmaAlerta API')
    .setDescription('Backend API para la gestión de medicamentos, farmacias y disponibilidad en tiempo real')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(envs.SWAGGER_PATH, app, document);

  await app.listen(envs.APP_PORT, envs.APP_HOST);
  console.log(`🚀 Application is running on: ${envs.APP_URL}`);
  console.log(`📚 Swagger documentation: ${envs.APP_URL}/${envs.SWAGGER_PATH}`);
}

bootstrap().catch((err) => {
  console.error('❌ Application failed to start:', err);
  process.exit(1);
});
