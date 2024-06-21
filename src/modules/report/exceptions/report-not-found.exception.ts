import { NotFoundException } from '@nestjs/common';

export class ReportNotFoundException extends NotFoundException {
  constructor() {
    super('error.reportNotFound');
  }
}
