import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GetRewardInfoQueryHandler } from './queries/get-reward-info.hanlder';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema, GameEvent } from '../event/schema/event.schema';
import { Reward, RewardSchema } from './schema/reward.schema';

@Module({
  imports: [CqrsModule,
    MongooseModule.forRoot(
      'mongodb://root:1234@localhost:27017/game?authSource=admin',
    ),
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
  ],
  controllers: [RewardController],
  providers: [RewardService, GetRewardInfoQueryHandler],
})
export class RewardModule {}
