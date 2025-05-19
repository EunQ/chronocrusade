import { Controller, UnauthorizedException } from '@nestjs/common';
import { EventService } from './event.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetEventListDto } from '../../../../common/dto/get-event-list.dto';
import { CreateEventDto } from '../../../../common/dto/create-event.dto';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern('get.events')
  async getEventList(@Payload() queryDto?: GetEventListDto) {
    return this.eventService.getEventList(queryDto ?? {});
  }

  // {
  //   "name": "3일 로그인 보상 이벤트",
  //   "description": "3일 연속 로그인 시 골드와 경험치를 드립니다.",
  //   "conditions": [
  //     {
  //       "type": "LOGIN_COUNT",
  //       "loginCount": 3
  //     }
  //   ],
  //   "rewardIds": ["RWD-202405191800-A1Xb7"],
  //   "startDate": "2025-06-01T00:00:00.000Z",
  //   "endDate": "2025-06-10T23:59:59.000Z",
  //   "isActive": true
  // }
  @MessagePattern('create.event')
  async createEventList(@Payload() queryDto?: CreateEventDto) {
    if (queryDto == null) throw new UnauthorizedException();
    return this.eventService.createEventList(queryDto, 'admin1');
  }

  // @MessagePattern('update.events')
  // async updateEventList(@Payload() queryDto?: GetEventListDto) {
  //   return this.eventService.getEventList(queryDto ?? {});
  // }
}