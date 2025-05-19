import { ICommand } from '@nestjs/cqrs';
import { CouponReward } from '../schema/reward.schema';

export class CreateRewardCommand implements ICommand {
  constructor(
    readonly coupons?: CouponReward[],
    readonly gold?: number,
    readonly exp?: number,
    readonly eventIds?: string[],
    readonly lastModifiedBy?: string,
  ) {}
}