import { NestFactory } from '@nestjs/core';
import { ChronoModule } from './chrono.module';

async function bootstrap() {
  const app = await NestFactory.create(ChronoModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
