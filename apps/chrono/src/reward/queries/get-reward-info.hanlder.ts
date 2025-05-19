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
      types,
      eventId,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {};
    if (rewardId) filter.rewardId = rewardId;
    if (lastModifiedBy) filter.lastModifiedBy = lastModifiedBy;
    if (eventId) filter.eventId = eventId;
    if (types?.length) {
      filter.items = { $elemMatch: { type: { $in: types } } };
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 } as Record<
      string,
      1 | -1
    >;

    const [data, total] = await Promise.all([
      this.rewardModel.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'events',
            localField: 'eventId', // 단일 eventId
            foreignField: 'eventId',
            as: 'event',
          },
        },
        {
          $unwind: {
            path: '$event',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            rewardId: 1,
            items: 1,
            version: 1,
            lastModifiedBy: 1,
            createdAt: 1,
            updatedAt: 1,
            event: {
              eventId: '$event.eventId',
              name: '$event.name',
              description: '$event.description',
              isActive: '$event.isActive',
              startDate: '$event.startDate',
              endDate: '$event.endDate',
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
