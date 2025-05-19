import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetEventInfoQuery } from './queries/get-event-info.query';
import { GetEventListDto } from '../../../../common/dto/get-event-list.dto';
import { CreateEventDto } from '../../../../common/dto/create-event.dto';
import { CreateEventCommand } from './commands/create-event.command';

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

    return this.queryBus.execute(query);
  }

  async createEventList(dto: CreateEventDto, lastModifiedBy: string) {
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
}
