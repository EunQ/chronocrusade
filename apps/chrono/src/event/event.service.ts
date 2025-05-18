import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDocument, GameEvent } from './dto/event.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(GameEvent.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  async findAll(): Promise<GameEvent[]> {
    return this.eventModel.find().lean().exec();
  }
}
