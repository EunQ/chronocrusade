import { NestFactory } from '@nestjs/core';
import { RosetteModule } from './rosette.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RosetteModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.ROSETTE_HOST || '127.0.0.1',
        port: Number(process.env.ROSETTE_PORT) || 8877,
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
