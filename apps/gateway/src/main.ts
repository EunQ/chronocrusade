import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  await ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [
      `config/.env.${process.env.NODE_ENV ?? 'local'}`, // ex: .env.docker, .env.local
    ],
  });

  const configService = new ConfigService();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(configService.get<number>('GATEWAY_PORT', 8878) ?? 3000);
}

bootstrap();
