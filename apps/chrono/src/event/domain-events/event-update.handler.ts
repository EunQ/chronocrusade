import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GameEventLog,
  EventLogAction,
  EventLogDocument,
} from '../schema/event-log.schema';
import { EventUpdatedEvent } from './event-updated.event';

@EventsHandler(EventUpdatedEvent)
export class EventUpdatedEventHandler
  implements IEventHandler<EventUpdatedEvent>
{
  constructor(
    @InjectModel(GameEventLog.name)
    private readonly eventLogModel: Model<EventLogDocument>,
  ) {}

  async handle(event: EventUpdatedEvent): Promise<void> {
    await this.eventLogModel.create({
      eventId: event.eventId,
      version: event.version,
      dataSnapshot: event.snapshot,
      modifiedBy: event.modifiedBy,
      action: EventLogAction.UPDATE,
      modifiedAt: new Date(),
    });
  }
}
