import mongoose from 'mongoose';
import { EventConditionType } from './event-condition.type';

export const EventConditionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: Object.values(EventConditionType),
  },
  invite_friend: { type: Number },
  kill_monster_id: { type: Number },
  count: { type: Number },
});
