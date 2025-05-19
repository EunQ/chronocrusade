import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../../../gateway/enums/roles.enum';

export type UserDocument = User & Document;

@Schema({ collection: 'users' })
export class User {
  @Prop({ required: true })
  id: string;

  @Prop({ required: false })
  encPassword?: string;

  @Prop({ required: true, type: [String], enum: Role })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
