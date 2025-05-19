import { ICommand } from '@nestjs/cqrs';
import { CouponReward } from '../schema/reward.schema';

export class UpdateRewardCommand implements ICommand {
  constructor(
    readonly rewardId: string, // 반드시 기준값 필요
    readonly coupons?: CouponReward[],
    readonly gold?: number,
    readonly exp?: number,
    readonly eventIds?: string[],
    readonly lastModifiedBy?: string,
  ) {}
}