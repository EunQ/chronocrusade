import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEventInfoQuery } from './get-event-info.query';
import { EventDocument, GameEvent } from '../schema/event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@QueryHandler(GetEventInfoQuery)
export class GetEventInfoQueryHandler
  implements IQueryHandler<GetEventInfoQuery>
{
  constructor(
    @InjectModel(GameEvent.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  async execute(query: GetEventInfoQuery): Promise<{
    data: GameEvent[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      eventId,
      isActive,
      lastModifiedBy,
      page,
      limit,
      sortBy,
      sortOrder,
    } = query;
    const filter: any = {};

    if (eventId) filter.eventId = eventId;
    if (typeof isActive === 'boolean') filter.isActive = isActive;

    if (lastModifiedBy) filter.lastModifiedBy = lastModifiedBy;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 } as Record<
      string,
      1 | -1
    >;

    const [data, total] = await Promise.all([
      this.eventModel.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'rewards',
            localField: 'rewardIds',
            foreignField: 'rewardId',
            as: 'rewards',
          },
        },
        {
          $addFields: {
            rewards: {
              $map: {
                input: '$rewards',
                as: 'reward',
                in: {
                  rewardId: '$$reward.rewardId',
                  items: '$$reward.items',
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            eventId: 1,
            name: 1,
            description: 1,
            startDate: 1,
            endDate: 1,
            isActive: 1,
            version: 1,
            lastModifiedBy: 1,
            createdAt: 1,
            updatedAt: 1,
            rewards: 1, // 위에서 가공한 rewards
          },
        },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
      ]),
      this.eventModel.countDocuments(filter),
    ]);

    return { data, total, page, limit };
  }
}
