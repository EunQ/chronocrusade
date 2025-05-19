import { IEvent } from '@nestjs/cqrs';
import { GameEvent } from '../schema/event.schema';

export class EventUpdatedEvent implements IEvent {
  constructor(
    public readonly eventId: string,
    public readonly version: number,
    public readonly snapshot: Partial<GameEvent>,
    public readonly modifiedBy: string,
  ) {}
}