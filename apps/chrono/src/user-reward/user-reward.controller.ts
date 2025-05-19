import { Controller } from '@nestjs/common';
import { UserRewardService } from './user-reward.service';

@Controller()
export class UserRewardController {
  constructor(private readonly userRewardService: UserRewardService) {}
}
