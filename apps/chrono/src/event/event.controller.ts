import { Controller } from '@nestjs/common';
import { EventService } from './event.service';
import { GameEvent } from './schema/event.schema';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetEventListDto } from './dto/get-event-list.dto';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern('/events')
  async getAllEvents(): Promise<GameEvent[]> {
    return this.eventService.findAll();
  }

  @MessagePattern('/events2')
  async getEventList(@Payload() queryDto?: GetEventListDto) {
    return this.eventService.getEventList(queryDto ?? {});
  }
}