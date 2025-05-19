import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardUpdatedEvent } from './reward-updated.event';
import {
  RewardLog,
  RewardLogAction,
  RewardLogDocument,
} from '../schema/reward-log.schema';

@EventsHandler(RewardUpdatedEvent)
export class RewardUpdatedEventHandler
  implements IEventHandler<RewardUpdatedEvent>
{
  constructor(
    @InjectModel(RewardLog.name, 'LOG')
    private readonly eventLogModel: Model<RewardLogDocument>,
  ) {}

  async handle(event: RewardUpdatedEvent): Promise<void> {
    await this.eventLogModel.create({
      rewardId: event.rewardId,
      version: event.version,
      dataSnapshot: event.snapshot,
      modifiedBy: event.modifiedBy,
      action: RewardLogAction.UPDATE,
      modifiedAt: new Date(),
    });
  }
}
