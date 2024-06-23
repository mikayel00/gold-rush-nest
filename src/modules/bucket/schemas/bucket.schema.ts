import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../user/user.schema';
import { Availability, AvailabilitySchema } from './availability.schema';
import { Report } from '../../report/report.schema';

export type BucketDocument = Bucket & mongoose.Document;
@Schema({ timestamps: true })
export class Bucket {
  @Prop({ required: true, type: String })
  eventId: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: User[];

  @Prop({ type: AvailabilitySchema, default: () => ({}) })
  availability: Availability;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }] })
  scores: Report[];
}

export const BucketSchema = SchemaFactory.createForClass(Bucket);
