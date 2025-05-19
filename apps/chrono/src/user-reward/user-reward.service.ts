import { Injectable } from '@nestjs/common';
import { UserRewardRequest } from '../../../../common/dto/user-reward.request';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RequestUserRewardCommand } from './commands/request-user-reward.command';
import { GetUserRewardLogDto } from '../../../../common/dto/get-user-reward-log.dto';
import { GetUserRewardLogQuery } from './queries/get-user-reward-log.query';

@Injectable()
export class UserRewardService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  requestUserReward(dto: UserRewardRequest, userId: string) {
    const command = new RequestUserRewardCommand({
      userId: userId,
      eventId: dto.eventId,
      eventVersion: dto.eventVersion,
      evaluations: dto.evaluations,
    });
    return this.commandBus.execute(command);
  }

  getUserRewardLogs(dto: GetUserRewardLogDto, userId?: string) {
    const query = new GetUserRewardLogQuery({
      userId: userId,
      eventId: dto.eventId,
      status: dto.status,
      page: dto.page,
      limit: dto.limit,
      sortBy: dto.sortBy,
      sortOrder: dto.sortOrder,
    });
    return this.queryBus.execute(query);
  }
}
