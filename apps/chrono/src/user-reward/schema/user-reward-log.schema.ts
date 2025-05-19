import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EvaluationItem } from '../types/evaluationItem';
import { UserRewardStatus } from '../enum/user-reward.status';
import { GameEvent } from '../../event/schema/event.schema';
import { Reward } from '../../reward/schema/reward.schema';

export type UserRewardLogDocument = UserRewardLog & Document;

@Schema({ timestamps: true, collection: 'user_reward_logs' })
export class UserRewardLog {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, type: Object })
  gameEventSnapshot: Partial<GameEvent>; // 최신 기록 로그

  @Prop({ required: true, type: Boolean })
  isConditionMet: boolean;

  @Prop({ required: true, type: Object })
  rewardSnapshot: Partial<Reward>; // 최신 기록 로그

  @Prop({
    type: [
      {
        type: { type: String, required: true },
        data: { type: Object, default: {} },
      },
    ],
    default: [],
  })
  evaluations: EvaluationItem[];

  @Prop({
    required: true,
    enum: UserRewardStatus,
    type: String,
    default: UserRewardStatus.PENDING,
  })
  status: UserRewardStatus;

  @Prop({ required: true })
  errorMessage?: string;
}

export const UserRewardLogSchema = SchemaFactory.createForClass(UserRewardLog);
