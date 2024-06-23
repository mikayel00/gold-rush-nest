import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

@Injectable()
export class UtilsService {
  getDifferenceInSeconds(dateString: Date): number {
    const givenDate = DateTime.fromJSDate(dateString).toLocal();
    const currentDate = DateTime.now();

    const difference = givenDate.diff(currentDate, 'seconds').seconds;
    return Math.round(difference);
  }
}
