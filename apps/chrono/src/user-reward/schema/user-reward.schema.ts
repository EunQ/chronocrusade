import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRewardItem } from '../types/user-reward.item';
import { UserRewardStatus } from '../enum/user-reward.status';

export type UserRewardDocument = UserReward & Document;

@Schema({ timestamps: true, collection: 'user_rewards' })
export class UserReward {
  @Prop({ required: true })
  userId: string;

  @Prop({
    type: [
      {
        type: { type: String, required: true },
        id: { type: String, required: false, default: null },
        count: { type: Number, required: true },
        eventId: { type: String, required: false },
        rewardId: { type: String, required: false },
      },
    ],
    default: [],
  })
  rewards: UserRewardItem[];

  @Prop({
    required: true,
    enum: UserRewardStatus,
    default: UserRewardStatus.PENDING,
  })
  status: UserRewardStatus;
}

export const UserRewardSchema = SchemaFactory.createForClass(UserReward);
