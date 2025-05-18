import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users' })
export class User {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, type: [String] })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
