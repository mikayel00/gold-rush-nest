import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EventStatusEnum } from '../../constants';

export type EventDocument = Event & mongoose.Document;
@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({
    required: true,
    type: String,
    enum: EventStatusEnum,
    default: EventStatusEnum.INACTIVE,
  })
  status: EventStatusEnum;

  @Prop({ required: true, type: Date, default: new Date().toISOString() })
  startDate: Date;

  @Prop({ required: true, type: Date })
  endDate: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
