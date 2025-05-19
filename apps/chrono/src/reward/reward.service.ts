import { Injectable } from '@nestjs/common';
import { GetRewardListDto } from '../../../../common/dto/get-reward-list.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetRewardInfoQuery } from './queries/get-reward-info.query';
import { CreateRewardDto } from '../../../../common/dto/create-reward.dto';
import { CreateRewardCommand } from './commands/create-reward.command';
import { UpdateRewardDto } from '../../../../common/dto/update-reward.dto';
import { UpdateRewardCommand } from './commands/update-event.command';
import { json } from "express";

@Injectable()
export class RewardService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getRewardList(dto: GetRewardListDto) {
    console.log(JSON.stringify(dto));

    const query = new GetRewardInfoQuery({
      rewardId: dto.rewardId,
      types: dto.types,
      page: dto.page ?? 1,
      limit: dto.limit ?? 10,
      sortBy: dto.sortBy ?? 'createdAt',
      sortOrder: dto.sortOrder ?? 'desc',
    });

    return this.queryBus.execute(query);
  }

  async createReward(dto: CreateRewardDto, lastModifiedBy: string) {
    const command = new CreateRewardCommand({
      items: dto.items,
      eventIds: dto.eventIds,
      lastModifiedBy: lastModifiedBy,
    });
    return this.commandBus.execute(command);
  }

  async updateReward(dto: UpdateRewardDto, lastModifiedBy: string) {
    const command = new UpdateRewardCommand({
      rewardId: dto.rewardId,
      items: dto.items,
      eventIds: dto.eventIds,
      lastModifiedBy: lastModifiedBy,
    });
    return this.commandBus.execute(command);
  }
}
