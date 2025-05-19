import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GetRewardInfoQueryHandler } from './queries/get-reward-info.hanlder';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from './schema/reward.schema';
import { RewardLog, RewardLogSchema } from './schema/reward-log.schema';
import { RewardUpdatedEventHandler } from './domain-events/reward-update.handler';
import { CreateRewardHandler } from './commands/create-event.handler';
import { UpdateRewardHandler } from './commands/update-event.handler';
import { LockModule } from '../../../../common/lock/lock.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CqrsModule,
    LockModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_GAME_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_LOG_URI'),
        connectionName: 'LOG',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
    MongooseModule.forFeature(
      [{ name: RewardLog.name, schema: RewardLogSchema }],
      'LOG',
    ),
  ],
  controllers: [RewardController],
  providers: [
    RewardService,
    GetRewardInfoQueryHandler,
    CreateRewardHandler,
    UpdateRewardHandler,
    RewardUpdatedEventHandler,
  ],
})
export class RewardModule {}
