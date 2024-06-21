import { Injectable } from '@nestjs/common';
import { EventDocument } from './event.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EventDto } from './dto/event.dto';
import { EventOptionsDto } from './dto/event-options.dto';
import { EventNotFoundException } from './exceptions/event-not-found.exception';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
  ) {}

  async getByStatus(
    eventOptionsDto: EventOptionsDto,
  ): Promise<EventDto | null> {
    const eventEntity = await this.eventModel
      .findOne({ status: eventOptionsDto.status })
      .exec();

    if (!eventEntity) {
      throw new EventNotFoundException();
    }
    return new EventDto(eventEntity);
  }

  async create(data: CreateEventDto): Promise<EventDto> {
    const createdEvent = new this.eventModel(data);
    await createdEvent.save();

    return new EventDto(createdEvent);
  }
}
