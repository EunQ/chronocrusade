import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateEventCommand } from './create-event.command';
import { InjectModel } from '@nestjs/mongoose';
import { EventDocument, GameEvent } from '../schema/event.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { generateEventId } from '../../../../../utils/id-gen';
import { LockService } from '../../../../../common/lock/lock.service';
import { RpcException } from '@nestjs/microservices';

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
      throw new RpcException(`이벤트 '${resourceId}'는 현재 처리 중입니다.`);
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

      const rEvent = await this.eventModel.create(eventData);

      return {
        eventId: rEvent.eventId,
        name: rEvent.name,
        description: rEvent.description,
        conditions: rEvent.conditions,
        rewardIds: rEvent.rewardIds,
        startDate: rEvent.startDate,
        endDate: rEvent.endDate,
        isActive: rEvent.isActive,
        version: rEvent.version,
        lastModifiedBy: rEvent.lastModifiedBy,
      };
    } finally {
      await this.lockService.releaseLock(GameEvent.name, resourceId);
    }
  }
}
