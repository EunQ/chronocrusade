import { Module } from '@nestjs/common';
import { UserRewardService } from './user-reward.service';
import { UserRewardController } from './user-reward.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { LockModule } from '../../../../common/lock/lock.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from '../reward/schema/reward.schema';
import { RequestUserRewardHandler } from './commands/request-user-reward.handler';
import { EventSchema, GameEvent } from '../event/schema/event.schema';
import { UserReward, UserRewardSchema } from './schema/user-reward.schema';
import {
  UserRewardLog,
  UserRewardLogSchema,
} from './schema/user-reward-log.schema';
import { GetUserRewardLogHandler } from './queries/get-user-reward-log.handler';
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

    MongooseModule.forFeature([
      { name: UserReward.name, schema: UserRewardSchema },
    ]),
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
    MongooseModule.forFeature([{ name: GameEvent.name, schema: EventSchema }]),
    MongooseModule.forFeature(
      [{ name: UserRewardLog.name, schema: UserRewardLogSchema }],
      'LOG',
    ),
  ],
  controllers: [UserRewardController],
  providers: [
    UserRewardService,
    RequestUserRewardHandler,
    GetUserRewardLogHandler,
  ],
})
export class UserRewardModule {}
