import { EventConditionType } from '../types/event-condition.type';
import { SchemaFactory } from '@nestjs/mongoose';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class EventCondition {
  @Prop({ type: String, required: true, enum: EventConditionType })
  type: EventConditionType;

  @Prop()
  loginCount?: number;

  @Prop()
  invite_friend?: number;

  @Prop()
  kill_monster_id?: number;

  @Prop()
  count?: number;
}

export const EventConditionSchema =
  SchemaFactory.createForClass(EventCondition);
