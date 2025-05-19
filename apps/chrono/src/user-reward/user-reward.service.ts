import { Injectable } from '@nestjs/common';
import { UserRewardRequest } from '../../../../common/dto/user-reward.request';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RequestUserRewardCommand } from './commands/request-user-reward.command';

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
}
