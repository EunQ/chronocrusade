import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `config/.env.${process.env.NODE_ENV ?? 'local'}`, // ex: .env.docker, .env.local
      ],
    }),
    ClientsModule.registerAsync([
      {
        name: 'ROSETTE_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('ROSETTE_HOST'),
            port: config.get<number>('ROSETTE_PORT'),
          },
        }),
      },
      {
        name: 'CHRONO_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('CHRONO_HOST'),
            port: config.get<number>('CHRONO_PORT'),
          },
        }),
      },
    ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
