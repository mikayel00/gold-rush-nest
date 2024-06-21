import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user/user.schema';

export type ReportDocument = Report & mongoose.Document;
@Schema({ timestamps: true })
export class Report {
  @Prop({ required: true, type: String })
  eventId: string;

  @Prop({ required: true, type: String })
  userEmail: string;

  @Prop({ required: true, type: Number, default: 0 })
  score: number;

  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } })
  user: User;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
