import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDocument, GameEvent } from './dto/event.schema';
import { QueryBus } from '@nestjs/cqrs';
import { GetEventInfoQuery } from './queries/get-event-info.query';
import { GetEventListDto } from './event.controller';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(GameEvent.name)
    private readonly eventModel: Model<EventDocument>,

    private readonly queryBus: QueryBus,
  ) {}

  async findAll(): Promise<GameEvent[]> {
    return this.eventModel.find().lean().exec();
  }

  async getEventList(dto: GetEventListDto) {
    console.log(`getEventList ${dto}`);
    const query = new GetEventInfoQuery(
      dto.eventId,
      dto.isActive,
      dto.lastModifiedBy,
      dto.page ?? 1,
      dto.limit ?? 10,
      dto.sortBy ?? 'createdAt',
      dto.sortOrder ?? 'desc',
    );

    return this.queryBus.execute(query);
  }
}
