import { Controller } from '@nestjs/common';
import { RewardService } from './reward.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetEventListDto } from '../../../../common/dto/get-event-list.dto';

@Controller()
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @MessagePattern('/rewards')
  async getRewardList(@Payload() queryDto?: GetEventListDto) {
    return this.rewardService.getRewardList(queryDto ?? {});
  }
}
