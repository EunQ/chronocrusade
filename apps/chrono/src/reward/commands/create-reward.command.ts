import { ICommand } from '@nestjs/cqrs';
import { RewardItem } from '../types/reward-item.type';

export class CreateRewardCommand implements ICommand {
  public readonly items: RewardItem[];
  public readonly lastModifiedBy: string;
  public readonly eventIds?: string[];

  constructor({
    items,
    lastModifiedBy,
    eventIds,
  }: {
    items: RewardItem[];
    lastModifiedBy: string;
    eventIds?: string[];
  }) {
    this.items = items;
    this.lastModifiedBy = lastModifiedBy;
    this.eventIds = eventIds;
  }
}
