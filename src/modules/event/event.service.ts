import { Injectable } from '@nestjs/common';
import { EventDocument } from './event.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EventDto } from './dto/event.dto';
import { EventOptionsDto } from './dto/event-options.dto';
import { EventNotFoundException } from './exceptions/event-not-found.exception';
import { CreateEventDto } from './dto/create-event.dto';
import { EventStatusEnum } from '../../constants';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UtilsService } from '../../shared/services/utils.service';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly utilsService: UtilsService,
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

  async getById(eventId: string): Promise<EventDocument | null> {
    const eventEntity = await this.eventModel.findById(eventId).exec();

    if (!eventEntity) {
      throw new EventNotFoundException();
    }
    return eventEntity;
  }

  async create(data: CreateEventDto): Promise<EventDto> {
    const createdEvent = new this.eventModel(data);
    await createdEvent.save();

    this.scheduleEventStart(createdEvent);
    this.scheduleEventEnd(createdEvent);

    return new EventDto(createdEvent);
  }

  private scheduleEventStart(event: EventDocument): void {
    const time = this.utilsService.getDifferenceInSeconds(event.startDate);

    const timeout = setTimeout(async () => {
      await this.updateStatus(event.id, EventStatusEnum.ACTIVE);
    }, time * 1000);

    this.schedulerRegistry.addTimeout(`event-${event.id}-start`, timeout);
  }

  private scheduleEventEnd(event: EventDocument): void {
    const time = this.utilsService.getDifferenceInSeconds(event.endDate);

    const timeout = setTimeout(async () => {
      await this.updateStatus(event.id, EventStatusEnum.FINISHED);
    }, time * 1000);

    this.schedulerRegistry.addTimeout(`event-${event.id}-end`, timeout);
  }

  private async updateStatus(
    eventId: string,
    eventStatus: EventStatusEnum,
  ): Promise<void> {
    await this.eventModel
      .findByIdAndUpdate(eventId, { status: eventStatus })
      .exec();
  }
}
