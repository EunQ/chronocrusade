import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GameEvent, EventSchema } from './schema/event.schema';
import { CqrsModule } from '@nestjs/cqrs';
import { GetEventInfoQueryHandler } from './queries/get-event-info.hanlder';
import { CreateEventHandler } from './commands/create-event.handler';
import { LockModule } from '../../../../common/lock/lock.module';
import { EventUpdatedEventHandler } from './domain-events/event-update.handler';
import { EventLogSchema, GameEventLog } from './schema/event-log.schema';
import { UpdateEventHandler } from './commands/update-event.handler';

@Module({
  imports: [
    CqrsModule,
    LockModule,
    MongooseModule.forRoot(
      'mongodb://root:1234@localhost:27017/game?authSource=admin',
    ),
    MongooseModule.forFeature([
      { name: GameEvent.name, schema: EventSchema },
      { name: GameEventLog.name, schema: EventLogSchema },
    ]),
  ],
  controllers: [EventController],
  providers: [
    EventService,
    GetEventInfoQueryHandler,
    CreateEventHandler,
    UpdateEventHandler,
    EventUpdatedEventHandler,
  ],
})
export class EventModule {}
