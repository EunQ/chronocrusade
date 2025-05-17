import { NestFactory } from '@nestjs/core';
import { RosetteModule } from './rosette.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RosetteModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: +(process.env.port ?? '8877'),
      },
    },
  );
  await app.listen();
}

bootstrap();
