import { NotFoundException } from '@nestjs/common';

export class BucketNotFoundException extends NotFoundException {
  constructor() {
    super('error.bucketNotFound');
  }
}
