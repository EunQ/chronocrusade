import { ICommand } from '@nestjs/cqrs';
import { RewardItem } from '../types/reward-item.type';

export class UpdateRewardCommand implements ICommand {
  public readonly rewardId: string;
  public readonly lastModifiedBy: string;
  public readonly items?: RewardItem[];
  public readonly eventIds?: string[];

  constructor({
    rewardId,
    lastModifiedBy,
    items,
    eventIds,
  }: {
    rewardId: string;
    lastModifiedBy: string;
    items?: RewardItem[];
    eventIds?: string[];
  }) {
    this.rewardId = rewardId;
    this.lastModifiedBy = lastModifiedBy;
    this.items = items;
    this.eventIds = eventIds;
  }
}
