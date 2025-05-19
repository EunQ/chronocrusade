import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LockService } from './lock.service';
import { MongoDBLock, MongoDBLockSchema } from './lock.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `config/.env.${process.env.NODE_ENV ?? 'local'}`, // ex: .env.docker, .env.local
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      connectionName: 'LOCK',
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_LOCK_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(
      [{ name: MongoDBLock.name, schema: MongoDBLockSchema }],
      'LOCK', // ✅ 명시적으로 연결 이름 지정
    ),
  ],
  providers: [LockService],
  exports: [LockService],
})
export class LockModule {}
