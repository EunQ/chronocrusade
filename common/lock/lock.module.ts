import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LockService } from './lock.service';
import { MongoDBLock, MongoDBLockSchema } from './lock.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:1234@localhost:27017/lock?authSource=admin',
      {
        connectionName: 'LOCK',
      },
    ),
    MongooseModule.forFeature(
      [{ name: MongoDBLock.name, schema: MongoDBLockSchema }],
      'LOCK', // ✅ 명시적으로 연결 이름 지정
    ),
  ],
  providers: [LockService],
  exports: [LockService],
})
export class LockModule {}
