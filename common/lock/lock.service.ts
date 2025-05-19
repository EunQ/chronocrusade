import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LockDocument, MongoDBLock } from './lock.schema';
import { MongoErrorCode } from '../mongo-error.code';

@Injectable()
export class LockService {
  constructor(
    @InjectModel(MongoDBLock.name, 'LOCK')
    private readonly lockModel: Model<LockDocument>,
  ) {}

  async acquireLock(
    resourceType: string,
    resourceId: string,
    ttlSeconds: number = 10,
  ): Promise<boolean> {
    const now = new Date();
    const expireAt = new Date(now.getTime() + ttlSeconds * 1000);

    try {
      await this.lockModel.create({
        _id: `lock:${resourceType}:${resourceId}`,
        resourceType,
        resourceId,
        expireAt,
        createdAt: now,
      });
      return true;
    } catch (e) {
      if (e.code === MongoErrorCode.DUPLICATE_KEY) {
        return false;
      }
      throw e;
    }
  }

  async releaseLock(resourceType: string, resourceId: string): Promise<void> {
    await this.lockModel
      .deleteOne({ _id: `lock:${resourceType}:${resourceId}` })
      .exec();
  }
}
