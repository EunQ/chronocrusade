import { Module } from '@nestjs/common';
import { RosetteController } from './rosette.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `config/.env.${process.env.NODE_ENV ?? 'local'}`, // ex: .env.docker, .env.local
      ],
    }),
  ],
  controllers: [RosetteController],
  providers: [],
})
export class RosetteModule {}
