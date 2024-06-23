import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ReportDocument = Report & mongoose.Document;
@Schema({ timestamps: true })
export class Report {
  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' } })
  eventId: string;

  @Prop({ required: true, type: String })
  userEmail: string;

  @Prop({ required: true, type: Number, default: 0 })
  score: number;

  @Prop({ type: Number, default: 0 })
  place: number;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
