import { EventCondition } from '../../apps/chrono/src/event/types/event-condition.type';

export class CreateEventDto {
  name: string;
  description: string;
  conditions: EventCondition[];
  rewardIds: string[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}
