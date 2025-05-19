import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward, RewardDocument } from '../schema/reward.schema';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateRewardCommand } from './update-event.command';
import { LockService } from '../../../../../common/lock/lock.service';
import { RewardUpdatedEvent } from '../domain-events/reward-updated.event';
import { RpcException } from '@nestjs/microservices';

@Injectable()
@CommandHandler(UpdateRewardCommand)
export class UpdateRewardHandler
  implements ICommandHandler<UpdateRewardCommand>
{
  constructor(
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<RewardDocument>,
    private readonly lockService: LockService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateRewardCommand): Promise<Reward> {
    const { rewardId, items, eventId, lastModifiedBy } = command;

    const locked = await this.lockService.acquireLock(Reward.name, rewardId, 5);
    if (!locked) {
      throw new RpcException(`보상 '${rewardId}'은 현재 수정 중입니다.`);
    }

    try {
      const existing = await this.rewardModel.findOne({ rewardId }).exec();
      if (!existing) {
        throw new RpcException(`Reward '${rewardId}' not found`);
      }

      this.eventBus.publish(
        new RewardUpdatedEvent(
          rewardId,
          existing.version,
          existing,
          command.lastModifiedBy,
        ),
      );

      if (items !== undefined) existing.items = items;
      if (eventId !== undefined) existing.eventId = eventId;
      existing.lastModifiedBy = lastModifiedBy;

      existing.version += 1;
      const rReward = await existing.save();
      return {
        rewardId: rReward.rewardId,
        eventId: rReward.eventId,
        version: rReward.version,
        lastModifiedBy: rReward.lastModifiedBy,
        items: rReward.items,
      };
    } finally {
      await this.lockService.releaseLock(Reward.name, rewardId);
    }
  }
}
