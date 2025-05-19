import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRewardStatus } from '../enum/user-reward.status';
import { UserRewardLog } from './user-reward-log.schema';

export type UserRewardDocument = UserReward & Document;

@Schema({ timestamps: true, collection: 'user_rewards' })
export class UserReward {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  eventVersion: number;

  @Prop({ required: true, type: Object })
  dataSnapshot: Partial<UserRewardLog>; // 최신 기록 로그

  @Prop({
    required: true,
    enum: UserRewardStatus,
    default: UserRewardStatus.PENDING,
  })
  status: UserRewardStatus;
}

export const UserRewardSchema = SchemaFactory.createForClass(UserReward);
