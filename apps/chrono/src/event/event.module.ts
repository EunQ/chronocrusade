import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GameEvent, EventSchema } from './dto/event.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:1234@localhost:27017/game?authSource=admin',
    ),
    MongooseModule.forFeature([{ name: GameEvent.name, schema: EventSchema }]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
