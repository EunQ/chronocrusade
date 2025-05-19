import { Controller } from '@nestjs/common';
import { UserRewardService } from './user-reward.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserRewardRequest } from '../../../../common/dto/user-reward.request';
import { GetUserRewardLogDto } from '../../../../common/dto/get-user-reward-log.dto';

@Controller()
export class UserRewardController {
  constructor(private readonly userRewardService: UserRewardService) {}

  @MessagePattern('request.userReward')
  async requestUserReward(@Payload() dto: UserRewardRequest) {
    return this.userRewardService.requestUserReward(dto, 'user1');
  }

  @MessagePattern('get.userRewardLogs')
  async getUserRewardLogs(@Payload() dto: GetUserRewardLogDto) {
    return this.userRewardService.getUserRewardLogs(dto, 'user1');
  }
}
