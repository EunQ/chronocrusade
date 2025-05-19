import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetEventInfoQuery } from './queries/get-event-info.query';
import { GetEventListDto } from '../../../../common/dto/get-event-list.dto';
import { CreateEventDto } from '../../../../common/dto/create-event.dto';
import { CreateEventCommand } from './commands/create-event.command';
import { UpdateEventDto } from '../../../../common/dto/update-event.dto';
import { UpdateEventCommand } from './commands/update-event.command';

@Injectable()
export class EventService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getEventList(dto: GetEventListDto) {
    const query = new GetEventInfoQuery(
      dto.eventId,
      dto.isActive,
      dto.lastModifiedBy,
      dto.page ?? 1,
      dto.limit ?? 10,
      dto.sortBy ?? 'createdAt',
      dto.sortOrder ?? 'desc',
    );

    console.log(JSON.stringify(query));
    return this.queryBus.execute(query);
  }

  async createEvent(dto: CreateEventDto, lastModifiedBy: string) {
    const command = new CreateEventCommand(
      dto.name,
      dto.description,
      dto.conditions,
      dto.rewardIds,
      dto.startDate,
      dto.endDate,
      dto.isActive,
      lastModifiedBy,
    );

    return this.commandBus.execute(command);
  }

  updateEvent(dto: UpdateEventDto, lastModifiedBy: string) {
    const command = new UpdateEventCommand(
      dto.eventId,
      dto.name,
      dto.description,
      dto.conditions,
      dto.rewardIds,
      dto.startDate,
      dto.endDate,
      dto.isActive,
      lastModifiedBy,
    );

    return this.commandBus.execute(command);
  }
}
