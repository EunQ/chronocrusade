import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ChronoModule } from './chrono.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ChronoModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.CHRONO_HOST || '127.0.0.1',
        port: Number(process.env.CHRONO_PORT) || 8877,
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen();
}

bootstrap();
