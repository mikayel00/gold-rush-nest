import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserTypeEnum } from '../../constants';

export type UserDocument = User & mongoose.Document;
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, type: String, enum: UserTypeEnum })
  type: UserTypeEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
