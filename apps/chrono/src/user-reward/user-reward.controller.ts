import { Controller } from '@nestjs/common';
import { UserRewardService } from './user-reward.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserRewardRequest } from '../../../../common/dto/user-reward.request';

@Controller()
export class UserRewardController {
  constructor(private readonly userRewardService: UserRewardService) {}

  @MessagePattern('request.userReward')
  async requestUserReward(@Payload() dto: UserRewardRequest) {
    return this.userRewardService.requestUserReward(dto, 'user1');
  }
}
