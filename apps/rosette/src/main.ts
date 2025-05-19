import { NestFactory } from '@nestjs/core';
import { RosetteModule } from './rosette.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
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
    RosetteModule,
    {
      transport: Transport.TCP,
      options: {
        host: configService.get<string>('ROSETTE_HOST', '127.0.0.1'),
        port: configService.get<number>('ROSETTE_PORT', 8877),
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
