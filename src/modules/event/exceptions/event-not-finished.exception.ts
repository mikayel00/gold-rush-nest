import { BadRequestException } from '@nestjs/common';

export class EventNotFinishedException extends BadRequestException {
  constructor() {
    super('error.eventNotFinished');
  }
}
