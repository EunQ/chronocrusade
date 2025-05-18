import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ChronoModule } from './chrono.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ChronoModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: +(process.env.CHRONO_PORT ?? '8878'), // Rosette와 다른 포트
      },
    },
  );
  await app.listen();
}

bootstrap();
