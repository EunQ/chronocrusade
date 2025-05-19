import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestUserRewardCommand } from './request-user-reward.command';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDocument, GameEvent } from '../../event/schema/event.schema';
import { Reward, RewardDocument } from '../../reward/schema/reward.schema';
import { UserReward, UserRewardDocument } from '../schema/user-reward.schema';
import {
  UserRewardLog,
  UserRewardLogDocument,
} from '../schema/user-reward-log.schema';
import { Injectable } from '@nestjs/common';
import { UserRewardStatus } from '../enum/user-reward.status';
import { LockService } from '../../../../../common/lock/lock.service';
import { evaluateEventCondition } from '../../event/types/event-condition.type';
import { RpcException } from '@nestjs/microservices';

@Injectable()
@CommandHandler(RequestUserRewardCommand)
export class RequestUserRewardHandler
  implements ICommandHandler<RequestUserRewardCommand>
{
  constructor(
    @InjectModel(GameEvent.name)
    private readonly eventModel: Model<EventDocument>,
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<RewardDocument>,
    @InjectModel(UserReward.name)
    private readonly userRewardModel: Model<UserRewardDocument>,
    @InjectModel(UserRewardLog.name, 'LOG')
    private readonly userRewardLogModel: Model<UserRewardLogDocument>,
    private readonly lockService: LockService,
  ) {}

  async execute(command: RequestUserRewardCommand): Promise<UserReward> {
    const { userId, eventId, eventVersion, evaluations } = command;

    const event = await this.eventModel.findOne({ eventId }).lean();
    if (!event || event.version !== eventVersion) {
      //이벤트 조건이 없는경우.
      return this.userRewardModel.create({
        userId,
        eventId,
        eventVersion,
        evaluations,
        status: UserRewardStatus.FAILED,
      });
    }

    // 실제 조건 평가 로직 (여기선 간단히 조건 key 포함 여부로 판단)
    const failedConditions: string[] = [];
    const allMatched = event.conditions.every((cond: any) => {
      const matched = evaluateEventCondition(cond, evaluations);
      if (!matched) {
        failedConditions.push(`조건 실패: ${cond.type}`);
      }
      return matched;
    });

    const errorMessage = allMatched
      ? null
      : failedConditions.join(', ') || '조건 불일치';
    const status = allMatched
      ? UserRewardStatus.COMPLETED
      : UserRewardStatus.FAILED;

    const reward = await this.rewardModel.findOne({ eventId }).lean();

    const resourceId = `${userId}-${eventId}`;
    const locked = this.lockService.acquireLock(
      UserReward.name,
      resourceId,
      10,
    );

    if (!locked) {
      throw new RpcException(
        `이벤트지급 '${resourceId}'은 현재 처리 중입니다.`,
      );
    }

    try {
      //실제 혜택을 지급하는 로직이 여기에 추가.
      const existing = await this.userRewardModel.findOne({ userId, eventId });
      if (existing && existing.status == UserRewardStatus.COMPLETED) {
        return existing;
      }

      //로그 저장
      const log = await this.userRewardLogModel.create({
        userId,
        gameEventSnapshot: event,
        isConditionMet: allMatched,
        rewardSnapshot: reward,
        evaluations,
        status,
        errorMessage: errorMessage,
      });

      if (existing) {
        // 이미 존재하면 업데이트
        await this.userRewardModel.updateOne(
          { userId, eventId },
          {
            $set: {
              eventId,
              eventVersion,
              logSnapshot: log,
              status,
            },
          },
        );

        return this.userRewardModel
          .findOne(
            { userId, eventId },
            {
              _id: 0,
              __v: 0,
              'logSnapshot._id': 0,
              'logSnapshot.__v': 0,
              'logSnapshot.updatedAt': 0,
              'logSnapshot.createdAt': 0,
              'logSnapshot.rewardSnapshot._id': 0,
              'logSnapshot.rewardSnapshot.__v': 0,
              'logSnapshot.rewardSnapshot.updatedAt': 0,
              'logSnapshot.rewardSnapshot.createdAt': 0,
              'logSnapshot.gameEventSnapshot._id': 0,
              'logSnapshot.gameEventSnapshot.__v': 0,
              'logSnapshot.gameEventSnapshot.updatedAt': 0,
              'logSnapshot.gameEventSnapshot.createdAt': 0,
              'logSnapshot.evaluations._id': 0,
              updatedAt: 0,
              createdAt: 0,
            },
          )
          .lean();
      } else {
        // 없으면 새로 생성
        await this.userRewardModel.create({
          userId,
          eventId,
          eventVersion,
          logSnapshot: log,
          status,
        });
        return this.userRewardModel
          .findOne(
            { userId, eventId },
            {
              _id: 0,
              __v: 0,
              'logSnapshot._id': 0,
              'logSnapshot.__v': 0,
              'logSnapshot.updatedAt': 0,
              'logSnapshot.createdAt': 0,
              'logSnapshot.rewardSnapshot._id': 0,
              'logSnapshot.rewardSnapshot.__v': 0,
              'logSnapshot.rewardSnapshot.updatedAt': 0,
              'logSnapshot.rewardSnapshot.createdAt': 0,
              'logSnapshot.gameEventSnapshot._id': 0,
              'logSnapshot.gameEventSnapshot.__v': 0,
              'logSnapshot.gameEventSnapshot.updatedAt': 0,
              'logSnapshot.gameEventSnapshot.createdAt': 0,
              'logSnapshot.evaluations._id': 0,
              updatedAt: 0,
              createdAt: 0,
            },
          )
          .lean();
      }
    } finally {
      await this.lockService.releaseLock(UserReward.name, resourceId);
    }
  }
}
