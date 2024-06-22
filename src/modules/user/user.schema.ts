import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserTypeEnum } from '../../constants';
import { Bucket } from '../bucket/schemas/bucket.schema';

export type UserDocument = User & mongoose.Document;
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, type: String })
  fullName: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String, enum: UserTypeEnum })
  type: UserTypeEnum;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bucket' }] })
  buckets: Bucket[];
}

export const UserSchema = SchemaFactory.createForClass(User);
