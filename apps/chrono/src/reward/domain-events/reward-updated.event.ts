import { IEvent } from '@nestjs/cqrs';
import { Reward } from '../schema/reward.schema';

export class RewardUpdatedEvent implements IEvent {
  constructor(
    public readonly rewardId: string,
    public readonly version: number,
    public readonly snapshot: Partial<Reward>,
    public readonly modifiedBy: string,
  ) {}
}