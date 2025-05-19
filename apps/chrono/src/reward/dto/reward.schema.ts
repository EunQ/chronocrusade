import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { generateRewardId } from '../../../../../utils/id-gen';

export class CouponReward {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  count: number;
}

@Schema({ timestamps: true, collection: 'rewards' })
export class Reward {
  @Prop({ required: true, unique: true })
  rewardId: string;

  @Prop({ type: [CouponReward], default: [] })
  coupons?: CouponReward[];

  @Prop()
  gold?: number;

  @Prop()
  exp?: number;

  @Prop({ type: [String], default: [] })
  eventIds: string[];

  @Prop({ default: 1 })
  version: number;

  @Prop()
  lastModifiedBy: string;
}

export type RewardDocument = Reward & Document;

const RewardSchema = SchemaFactory.createForClass(Reward);

RewardSchema.pre('save', function (next) {
  if (!this.rewardId) {
    this.rewardId = generateRewardId();
  }
  next();
});

export { RewardSchema };
