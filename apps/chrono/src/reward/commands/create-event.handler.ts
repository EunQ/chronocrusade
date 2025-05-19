import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRewardCommand } from './create-reward.command';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward, RewardDocument } from '../schema/reward.schema';
import { generateRewardId } from '../../../../../utils/id-gen';
import { Injectable } from '@nestjs/common';
import { LockService } from '../../../../../common/lock/lock.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
@CommandHandler(CreateRewardCommand)
export class CreateRewardHandler
  implements ICommandHandler<CreateRewardCommand>
{
  constructor(
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<RewardDocument>,
    private readonly lockService: LockService,
  ) {}

  async execute(command: CreateRewardCommand): Promise<Reward> {
    const rewardId = generateRewardId();
    const resourceId = rewardId; // 혹은 eventId 또는 유니크 키

    const locked = await this.lockService.acquireLock(
      Reward.name,
      resourceId,
      5,
    );

    if (!locked) {
      throw new RpcException(`이벤트 '${resourceId}'는 현재 처리 중입니다.`);
    }

    try {
      const reward: Partial<Reward> = {
        rewardId: rewardId,
        items: command.items,
        eventId: command.eventId,
        lastModifiedBy: command.lastModifiedBy,
        version: 1,
      };
      return await this.rewardModel.create(reward);
    } finally {
      await this.lockService.releaseLock(Reward.name, resourceId);
    }
  }
}
