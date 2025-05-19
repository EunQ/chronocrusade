import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { GameEvent } from './event.schema';

export enum EventLogAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export type EventLogDocument = GameEventLog & Document;

@Schema({ timestamps: true, collection: 'event_logs' })
export class GameEventLog {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Event' })
  eventId: Types.ObjectId; // 원본 이벤트 참조

  @Prop({ required: true })
  version: number;

  @Prop({ required: true, type: Object })
  dataSnapshot: Partial<GameEvent>; // 당시 이벤트 전체 데이터 복사본

  @Prop({ required: true })
  modifiedBy: string;

  @Prop({ required: true, enum: EventLogAction })
  action: EventLogAction;

  @Prop({ default: Date.now })
  modifiedAt: Date;
}

export const EventLogSchema = SchemaFactory.createForClass(GameEventLog);
