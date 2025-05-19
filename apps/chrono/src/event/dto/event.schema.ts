import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventCondition } from './event-condition.type';
import { EventConditionSchema } from './event-condition.schema';
import { generateEventId } from '../../../../../utils/id-gen';

export type EventDocument = GameEvent & Document;

@Schema({ timestamps: true, collection: 'events' }) // 생성일/수정일 자동 저장
export class GameEvent {
  @Prop({ required: true, unique: true })
  eventId: string; // 외부 노출용 식별자

  @Prop({ required: true })
  name: string; // 이벤트 이름

  @Prop()
  description: string; // 이벤트 이름

  @Prop({ required: true, type: [EventConditionSchema] })
  conditions: EventCondition[]; // 이벤트 조건.

  @Prop({ type: [String], required: true })
  rewardIds: string[]; // 참조용 rewardId 배열

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: true })
  isActive: boolean; // true: 활성, false: 비활성

  @Prop({ default: 1 })
  version: number;

  @Prop()
  lastModifiedBy: string;
}

const EventSchema = SchemaFactory.createForClass(GameEvent);

EventSchema.pre('save', function (next) {
  if (!this.eventId) {
    this.eventId = generateEventId();
  }
  next();
});

export { EventSchema };