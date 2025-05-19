import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Reward } from './reward.schema';

export enum RewardLogAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export type RewardLogDocument = RewardLog & Document;

@Schema({ timestamps: true, collection: 'reward_logs' })
export class RewardLog {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Reward' })
  rewardId: Types.ObjectId; // 원본 이벤트 참조

  @Prop({ required: true })
  version: number;

  @Prop({ required: true, type: Object })
  dataSnapshot: Partial<Reward>; // 당시 이벤트 전체 데이터 복사본

  @Prop({ required: true })
  modifiedBy: string;

  @Prop({ required: true, enum: RewardLogAction })
  action: RewardLogAction;

  @Prop({ default: Date.now })
  modifiedAt: Date;
}

export const RewardLogSchema = SchemaFactory.createForClass(RewardLog);
