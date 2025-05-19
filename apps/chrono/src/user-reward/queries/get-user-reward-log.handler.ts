import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserRewardLogQuery } from './get-user-reward-log.query';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserReward, UserRewardDocument } from '../schema/user-reward.schema';
import {
  UserRewardLog,
  UserRewardLogDocument,
} from '../schema/user-reward-log.schema';

@QueryHandler(GetUserRewardLogQuery)
export class GetUserRewardLogHandler
  implements IQueryHandler<GetUserRewardLogQuery>
{
  constructor(
    @InjectModel(UserReward.name)
    private readonly userRewardModel: Model<UserRewardDocument>,
    @InjectModel(UserRewardLog.name, 'LOG')
    private readonly userRewardLogModel: Model<UserRewardLogDocument>,
  ) {}

  async execute(query: GetUserRewardLogQuery): Promise<{
    data: any[]; // UserRewardLog
    total: number;
    page: number;
    limit: number;
  }> {
    console.log(`execute ${JSON.stringify(query)}`);

    const {
      userId,
      eventId,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    if (query.isFirstLog()) {
      const reward = await this.userRewardModel
        .findOne({ userId, eventId })
        .lean();
      return {
        data: [reward.logSnapshot],
        total: 1,
        page: 1,
        limit: 1,
      };
    }

    const filter: any = {};
    if (userId) filter.userId = userId;
    if (eventId) filter.eventId = eventId;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 } as Record<
      string,
      1 | -1
    >;

    const [data, total] = await Promise.all([
      this.userRewardLogModel.aggregate([
        { $match: filter },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
      ]),
      this.userRewardLogModel.countDocuments(filter),
    ]);

    return { data, total, page, limit };
  }
}
