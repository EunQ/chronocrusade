import { EventCondition } from '../../apps/chrono/src/event/types/event-condition.type';

export class GetUserRewardLogDto {
  constructor(
    readonly name: string,
    readonly description: string,
    readonly conditions: EventCondition[],
    readonly rewardIds: string[],
    readonly startDate: Date,
    readonly endDate: Date,
    readonly isActive: boolean,
  ) {}
}
