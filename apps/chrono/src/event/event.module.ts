import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GameEvent, EventSchema } from './schema/event.schema';
import { CqrsModule } from '@nestjs/cqrs';
import { GetEventInfoQueryHandler } from './queries/get-event-info.hanlder';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forRoot(
      'mongodb://root:1234@localhost:27017/game?authSource=admin',
    ),
    MongooseModule.forFeature([{ name: GameEvent.name, schema: EventSchema }]),
  ],
  controllers: [EventController],
  providers: [EventService, GetEventInfoQueryHandler],
})
export class EventModule {}
