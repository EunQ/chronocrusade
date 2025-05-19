import { Module } from '@nestjs/common';
import { ChronoController } from './chrono.controller';
import { ChronoService } from './chrono.service';
import { EventModule } from './event/event.module';
import { RewardModule } from './reward/reward.module';

@Module({
  imports: [EventModule, RewardModule],
  controllers: [ChronoController],
  providers: [ChronoService],
})
export class ChronoModule {}
