import { Controller } from '@nestjs/common';
import { RewardService } from './reward.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetEventListDto } from '../../../../common/dto/get-event-list.dto';
import { CreateRewardDto } from '../../../../common/dto/create-reward.dto';
import { UpdateRewardDto } from '../../../../common/dto/update-reward.dto';

@Controller()
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @MessagePattern('get.rewards')
  async getRewardList(@Payload() queryDto?: GetEventListDto) {
    return this.rewardService.getRewardList(queryDto ?? {});
  }

  @MessagePattern('create.reward')
  async createReward(@Payload() dto: CreateRewardDto) {
    return this.rewardService.createReward(dto, 'admin1');
  }

  @MessagePattern('update.reward')
  async updateReward(@Payload() dto: UpdateRewardDto) {
    return this.rewardService.updateReward(dto, 'admin1');
  }
}
