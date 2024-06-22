import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Availability {
  @Prop({ type: Number, default: 10 })
  whale: number;

  @Prop({ type: Number, default: 40 })
  dolphin: number;

  @Prop({ type: Number, default: 150 })
  fish: number;
}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability);
