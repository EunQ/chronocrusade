import { Controller, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { GameEvent } from './dto/event.schema';
import { MessagePattern, Payload } from '@nestjs/microservices';

export class GetEventListDto {
  eventId?: string;
  isActive?: boolean;
  lastModifiedBy?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

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