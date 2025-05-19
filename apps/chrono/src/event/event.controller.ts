import { Controller, UnauthorizedException } from '@nestjs/common';
import { EventService } from './event.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetEventListDto } from '../../../../common/dto/get-event-list.dto';
import { CreateEventDto } from '../../../../common/dto/create-event.dto';
import { UpdateEventDto } from '../../../../common/dto/update-event.dto';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern('get.events')
  async getEventList(@Payload() queryDto?: GetEventListDto) {
    return this.eventService.getEventList(queryDto ?? {});
  }

  @MessagePattern('create.event')
  async createEvent(@Payload() queryDto?: CreateEventDto) {
    if (queryDto == null) throw new UnauthorizedException();
    return this.eventService.createEvent(queryDto, 'admin1');
  }

  @MessagePattern('update.event')
  async updateEventList(@Payload() queryDto: UpdateEventDto) {
    return this.eventService.updateEvent(queryDto, 'admin1');
  }
}
