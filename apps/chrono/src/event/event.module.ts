import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema, GameEvent } from './schema/event.schema';
import { CqrsModule } from '@nestjs/cqrs';
import { GetEventInfoQueryHandler } from './queries/get-event-info.hanlder';
import { CreateEventHandler } from './commands/create-event.handler';
import { LockModule } from '../../../../common/lock/lock.module';
import { EventUpdatedEventHandler } from './domain-events/event-update.handler';
import { EventLogSchema, GameEventLog } from './schema/event-log.schema';
import { UpdateEventHandler } from './commands/update-event.handler';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CqrsModule,
    LockModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_GAME_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_LOG_URI'),
        connectionName: 'LOG',
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([{ name: GameEvent.name, schema: EventSchema }]),
    MongooseModule.forFeature(
      [{ name: GameEventLog.name, schema: EventLogSchema }],
      'LOG',
    ),
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
