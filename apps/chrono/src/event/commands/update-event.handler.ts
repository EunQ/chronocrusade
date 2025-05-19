import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateEventCommand } from './update-event.command';
import { InjectModel } from '@nestjs/mongoose';
import { EventDocument, GameEvent } from '../schema/event.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { LockService } from '../../../../../common/lock/lock.service';
import { EventUpdatedEvent } from '../domain-events/event-updated.event';
import { RpcException } from '@nestjs/microservices';

@Injectable()
@CommandHandler(UpdateEventCommand)
export class UpdateEventHandler implements ICommandHandler<UpdateEventCommand> {
  constructor(
    @InjectModel(GameEvent.name)
    private readonly eventModel: Model<EventDocument>,
    private readonly lockService: LockService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateEventCommand): Promise<GameEvent> {
    const {
      eventId,
      name,
      description,
      conditions,
      rewardIds,
      startDate,
      endDate,
      isActive,
      lastModifiedBy,
    } = command;

    const locked = await this.lockService.acquireLock(
      GameEvent.name,
      eventId,
      5,
    );
    if (!locked) {
      throw new RpcException(`이벤트 '${eventId}'는 현재 수정 중입니다.`);
    }

    try {
      const existingEvent = await this.eventModel.findOne({ eventId }).exec();
      if (!existingEvent) {
        throw new RpcException(`이벤트 '${eventId}'를 찾을 수 없습니다.`);
      }

      this.eventBus.publish(
        new EventUpdatedEvent(
          eventId,
          existingEvent.version,
          existingEvent,
          command.lastModifiedBy,
        ),
      );

      // 필드 업데이트 (nullable 체크)
      if (name !== undefined) existingEvent.name = name;
      if (description !== undefined) existingEvent.description = description;
      if (conditions !== undefined) existingEvent.conditions = conditions;
      if (rewardIds !== undefined) existingEvent.rewardIds = rewardIds;
      if (startDate !== undefined) existingEvent.startDate = startDate;
      if (endDate !== undefined) existingEvent.endDate = endDate;
      if (isActive !== undefined) existingEvent.isActive = isActive;
      if (lastModifiedBy !== undefined)
        existingEvent.lastModifiedBy = lastModifiedBy;

      existingEvent.version += 1; // 수동 버전 증가
      return await existingEvent.save();
    } finally {
      await this.lockService.releaseLock(GameEvent.name, eventId);
    }
  }
}
