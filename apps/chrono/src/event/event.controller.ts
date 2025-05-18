import { Controller } from '@nestjs/common';
import { EventService } from './event.service';
import { GameEvent } from './dto/event.schema';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern('/events')
  async getAllEvents(): Promise<GameEvent[]> {
    return this.eventService.findAll();
  }
}
