import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ChronoModule } from './chrono.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

async function bootstrap() {
  await ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [
      `config/.env.${process.env.NODE_ENV ?? 'local'}`, // ex: .env.docker, .env.local
    ],
  });
  const configService = new ConfigService();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ChronoModule,
    {
      transport: Transport.TCP,
      options: {
        host: configService.get<string>('CHRONO_HOST', '127.0.0.1'),
        port: configService.get<number>('CHRONO_PORT', 8878),
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
