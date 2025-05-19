import { ICommand } from '@nestjs/cqrs';
import { EventCondition } from '../types/event-condition.type';

export class CreateEventCommand implements ICommand {
  constructor(
    readonly name: string,
    readonly description: string,
    readonly conditions: EventCondition[],
    readonly rewardIds: string[],
    readonly startDate: Date,
    readonly endDate: Date,
    readonly isActive: boolean,
    readonly lastModifiedBy: string,
  ) {}
}
