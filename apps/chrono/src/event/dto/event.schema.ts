import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventCondition } from './event-condition.type';
import { EventConditionSchema } from './event-condition.schema';
import { EventReward } from './event-reward.type';
import { EventRewardSchema } from './event-reward.schema';

export type EventDocument = GameEvent & Document;

@Schema({ timestamps: true, collection: 'events' }) // 생성일/수정일 자동 저장
export class GameEvent {
  @Prop({ required: true })
  name: string; // 이벤트 이름

  @Prop()
  description: string; // 이벤트 이름

  @Prop({ required: true, type: [EventConditionSchema] })
  conditions: EventCondition[]; // 예: ['로그인 3일', '친구 초대']

  @Prop({ required: true, type: [EventRewardSchema] })
  reward: EventReward;

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

export const EventSchema = SchemaFactory.createForClass(GameEvent);
