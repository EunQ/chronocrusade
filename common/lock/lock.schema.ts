// src/common/lock/lock.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LockDocument = MongoDBLock & Document;

@Schema({ collection: 'locks', timestamps: true }) // createdAt 자동 생성됨
export class MongoDBLock {
  @Prop({ required: true, unique: true })
  _id: string; // lock:대상건_id 형식

  @Prop({ required: true })
  resourceType: string;

  @Prop({ required: true })
  resourceId: string;

  @Prop()
  lockedBy?: string;

  @Prop({ required: true })
  expireAt: Date;
}

export const MongoDBLockSchema = SchemaFactory.createForClass(MongoDBLock);

// TTL 인덱스 설정
MongoDBLockSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 }); //만료시간이 되자마자 삭제.
