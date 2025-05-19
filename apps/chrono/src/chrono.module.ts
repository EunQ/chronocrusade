import { Module } from '@nestjs/common';
import { ChronoController } from './chrono.controller';
import { ChronoService } from './chrono.service';
import { EventModule } from './event/event.module';
import { RewardModule } from './reward/reward.module';
import { UserRewardModule } from './user-reward/user-reward.module';

@Module({
  imports: [EventModule, RewardModule, UserRewardModule],
  controllers: [ChronoController],
  providers: [ChronoService],
})
export class ChronoModule {}
