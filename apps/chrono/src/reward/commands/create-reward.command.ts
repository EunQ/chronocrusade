import { ICommand } from '@nestjs/cqrs';
import { RewardItem } from '../types/reward-item.type';

export class CreateRewardCommand implements ICommand {
  public readonly items: RewardItem[];
  public readonly lastModifiedBy: string;
  public readonly eventId?: string;

  constructor({
    items,
    lastModifiedBy,
    eventId,
  }: {
    items: RewardItem[];
    lastModifiedBy: string;
    eventId?: string;
  }) {
    this.items = items;
    this.lastModifiedBy = lastModifiedBy;
    this.eventId = eventId;
  }
}
