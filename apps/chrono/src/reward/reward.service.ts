import { Injectable } from '@nestjs/common';
import { GetRewardListDto } from '../../../../common/dto/get-reward-list.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetRewardInfoQuery } from './queries/get-reward-info.query';
import { CreateRewardDto } from '../../../../common/dto/create-reward.dto';
import { CreateRewardCommand } from './commands/create-reward.command';
import { UpdateRewardDto } from '../../../../common/dto/update-reward.dto';
import { UpdateRewardCommand } from './commands/update-event.command';

@Injectable()
export class RewardService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getRewardList(dto: GetRewardListDto) {
    const query = new GetRewardInfoQuery(
      dto.rewardId,
      dto.lastModifiedBy,
      dto.page ?? 1,
      dto.limit ?? 10,
      dto.sortBy ?? 'createdAt',
      dto.sortOrder ?? 'desc',
    );

    return this.queryBus.execute(query);
  }

  async createReward(dto: CreateRewardDto, lastModifiedBy: string) {
    const command = new CreateRewardCommand(
      dto.coupons,
      dto.gold,
      dto.exp,
      dto.eventIds,
      lastModifiedBy,
    );
    return this.commandBus.execute(command);
  }

  async updateReward(dto: UpdateRewardDto, lastModifiedBy: string) {
    const command = new UpdateRewardCommand(
      dto.rewardId,
      dto.coupons,
      dto.gold,
      dto.exp,
      dto.eventIds,
      lastModifiedBy,
    );
    return this.commandBus.execute(command);
  }
}
