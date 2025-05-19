import { Injectable } from '@nestjs/common';
import { GetRewardListDto } from './dto/get-reward-list.dto';
import { QueryBus } from '@nestjs/cqrs';
import { GetRewardInfoQuery } from './queries/get-reward-info.query';

@Injectable()
export class RewardService {
  constructor(private readonly queryBus: QueryBus) {}

  getRewardList(dto: GetRewardListDto) {
    console.log(`GetEventListDto ${dto}`);
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
}
