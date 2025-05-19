import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRewardInfoQuery } from './get-reward-info.query';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward, RewardDocument } from '../schema/reward.schema';

@QueryHandler(GetRewardInfoQuery)
export class GetRewardInfoQueryHandler
  implements IQueryHandler<GetRewardInfoQuery>
{
  constructor(
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<RewardDocument>,
  ) {}

  async execute(query: GetRewardInfoQuery): Promise<{
    data: any[]; // Reward + joined Event[]
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      rewardId,
      lastModifiedBy,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {};
    if (rewardId) filter.rewardId = rewardId;
    if (lastModifiedBy) filter.lastModifiedBy = lastModifiedBy;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 } as Record<string, 1 | -1>;

    const [data, total] = await Promise.all([
      this.rewardModel.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'events',
            localField: 'eventIds',
            foreignField: 'eventId',
            as: 'events',
          },
        },
        {
          $addFields: {
            events: {
              $map: {
                input: '$events',
                as: 'event',
                in: {
                  eventId: '$$event.eventId',
                  name: '$$event.name',
                  description: '$$event.description',
                  isActive: '$$event.isActive',
                  startDate: '$$event.startDate',
                  endDate: '$$event.endDate',
                },
              },
            },
          },
        },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
      ]),
      this.rewardModel.countDocuments(filter),
    ]);

    return { data, total, page, limit };
  }
}
