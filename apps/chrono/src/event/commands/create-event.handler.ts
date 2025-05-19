import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateEventCommand } from './create-event.command';
import { InjectModel } from '@nestjs/mongoose';
import { GameEvent, EventDocument } from '../schema/event.schema';
import { Model } from 'mongoose';
import { ConflictException, Injectable } from '@nestjs/common';
import { generateEventId } from '../../../../../utils/id-gen';
import { LockService } from '../../../../../common/lock/lock.service';

@Injectable()
@CommandHandler(CreateEventCommand)
export class CreateEventHandler implements ICommandHandler<CreateEventCommand> {
  constructor(
    @InjectModel(GameEvent.name)
    private readonly eventModel: Model<EventDocument>,
    private readonly lockService: LockService,
  ) {}

  async execute(command: CreateEventCommand): Promise<GameEvent> {
    const {
      name,
      description,
      conditions,
      rewardIds,
      startDate,
      endDate,
      isActive,
      lastModifiedBy,
    } = command;

    const eventId = generateEventId();
    const resourceId = eventId; // 혹은 eventId 또는 유니크 키

    const locked = await this.lockService.acquireLock(
      GameEvent.name,
      resourceId,
      5,
    );
    if (!locked) {
      throw new ConflictException(
        `이벤트 '${resourceId}'는 현재 처리 중입니다.`,
      );
    }

    try {
      const eventData: Partial<GameEvent> = {
        eventId,
        name,
        description,
        conditions,
        rewardIds,
        startDate,
        endDate,
        isActive,
        lastModifiedBy,
      };

      return await this.eventModel.create(eventData);
    } finally {
      await this.lockService.releaseLock(GameEvent.name, resourceId);
    }
  }
}
