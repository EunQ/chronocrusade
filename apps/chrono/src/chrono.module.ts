import { Module } from '@nestjs/common';
import { ChronoController } from './chrono.controller';
import { ChronoService } from './chrono.service';
import { EventModule } from './event/event.module';
import { ConfigModule } from '@nestjs/config';
import { RewardModule } from './reward/reward.module';
import { UserRewardModule } from './user-reward/user-reward.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `config/.env.${process.env.NODE_ENV ?? 'local'}`, // ex: .env.docker, .env.local
      ],
    }),
    EventModule,
    RewardModule,
    UserRewardModule,
  ],
  controllers: [ChronoController],
  providers: [ChronoService],
})
export class ChronoModule {}
