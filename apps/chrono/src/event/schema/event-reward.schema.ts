import * as mongoose from 'mongoose';

export const EventRewardSchema = new mongoose.Schema({
  coupon: { type: String },
  gold: { type: Number },
  exp: { type: Number },
});