import { ICommand } from '@nestjs/cqrs';
import { RewardItem } from '../types/reward-item.type';

export class UpdateRewardCommand implements ICommand {
  public readonly rewardId: string;
  public readonly lastModifiedBy: string;
  public readonly items?: RewardItem[];
  public readonly eventId?: string;

  constructor({
    rewardId,
    lastModifiedBy,
    items,
    eventId,
  }: {
    rewardId: string;
    lastModifiedBy: string;
    items?: RewardItem[];
    eventId?: string;
  }) {
    this.rewardId = rewardId;
    this.lastModifiedBy = lastModifiedBy;
    this.items = items;
    this.eventId = eventId;
  }
}
