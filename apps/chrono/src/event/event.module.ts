import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GameEvent, EventSchema } from './schema/event.schema';
import { CqrsModule } from '@nestjs/cqrs';
import { GetEventInfoQueryHandler } from './queries/get-event-info.hanlder';
import { CreateEventHandler } from './commands/create-event.handler';
import { LockModule } from '../../../../common/lock/lock.module';

@Module({
  imports: [
    CqrsModule,
    LockModule,
    MongooseModule.forRoot(
      'mongodb://root:1234@localhost:27017/game?authSource=admin',
      { connectionName: 'EVENT' },
    ),
    MongooseModule.forFeature(
      [{ name: GameEvent.name, schema: EventSchema }],
      'EVENT',
    ),
  ],
  controllers: [EventController],
  providers: [EventService, GetEventInfoQueryHandler, CreateEventHandler],
})
export class EventModule {}
