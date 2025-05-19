// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { RequestUserRewardCommand } from '../commands/request-user-reward.command';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { EventDocument, GameEvent } from '../../event/schema/event.schema';
// import { Reward, RewardDocument } from '../../reward/schema/reward.schema';
// import { UserReward, UserRewardDocument } from '../schema/user-reward.schema';
// import {
//   UserRewardLog,
//   UserRewardLogDocument,
// } from '../schema/user-reward-log.schema';
// import { EvaluationItem } from '../types/evaluationItem';
// import { Injectable } from '@nestjs/common';
// import { UserRewardStatus } from '../enum/user-reward.status';
//
// @Injectable()
// @CommandHandler(RequestUserRewardCommand)
// export class RequestUserRewardHandler
//   implements ICommandHandler<RequestUserRewardCommand>
// {
//   constructor(
//     @InjectModel(GameEvent.name)
//     private readonly eventModel: Model<EventDocument>,
//     @InjectModel(Reward.name)
//     private readonly rewardModel: Model<RewardDocument>,
//     @InjectModel(UserReward.name)
//     private readonly userRewardModel: Model<UserRewardDocument>,
//     @InjectModel(UserRewardLog.name)
//     private readonly userRewardLogModel: Model<UserRewardLogDocument>,
//   ) {}
//
//   async execute(command: RequestUserRewardCommand): Promise<UserReward> {
//     const { userId, eventId, eventVersion, evaluations } = command;
//
//     const event = await this.eventModel.findOne({ eventId }).lean();
//     if (!event || event.version !== eventVersion) {
//       //이벤트 조건이 없는경우.
//       return this.userRewardModel.create({
//         userId,
//         eventId,
//         eventVersion,
//         evaluations,
//         status: UserRewardStatus.FAILED,
//       });
//     }
//
//     // 실제 조건 평가 로직 (여기선 간단히 조건 key 포함 여부로 판단)
//     const allMatched = event.conditions.every((cond: any) =>
//       evaluations.some(
//         (evalItem: EvaluationItem) => evalItem.type === cond.type,
//       ),
//     );
//
//     const status = allMatched
//       ? UserRewardStatus.COMPLETED
//       : UserRewardStatus.FAILED;
//
//     const reward = await this.rewardModel.findOne({ eventId }).lean();
//
//     const userReward = await this.userRewardModel.create({
//       userId,
//       eventId,
//       eventVersion,
//       evaluations,
//       status,
//     });
//
//     //실제 혜택을 지급하는 로직이 여기에 추가.
//
//     //로그 저장
//     await this.userRewardLogModel.create({
//       userId,
//       eventId,
//       eventVersion,
//       status,
//       evaluations,
//       snapshot: userReward,
//     });
//
//     const userReward = await this.userRewardModel.create({
//       userId,
//       eventId,
//       eventVersion,
//       evaluations,
//       status,
//     });
//
//     return userReward;
//   }
// }
