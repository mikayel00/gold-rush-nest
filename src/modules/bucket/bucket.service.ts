import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bucket, BucketDocument } from './schemas/bucket.schema';
import { EventDto } from '../event/dto/event.dto';
import { UserDocument } from '../user/user.schema';
import { UserTypeEnum } from '../../constants';

@Injectable()
export class BucketService {
  constructor(
    @InjectModel(Bucket.name)
    private readonly bucketModel: Model<BucketDocument>,
  ) {}

  async create(eventDto: EventDto): Promise<BucketDocument> {
    const createdBucket = new this.bucketModel({ eventId: eventDto.id });
    await createdBucket.save();

    return createdBucket;
  }

  async getAvailable(
    eventDto: EventDto,
    user: UserDocument,
  ): Promise<BucketDocument | null> {
    const buckets = await this.bucketModel
      .find({ eventId: eventDto.id })
      .sort({ createdAt: 'asc' })
      .exec();

    if (!buckets.length) {
      const bucket = await this.create(eventDto);
      await this.joinToBucket(bucket, user);

      return bucket;
    }

    for (const bucket of buckets) {
      if (this.isUserJoined(bucket, user)) {
        return bucket;
      }
      if (this.isBucketAvailable(bucket, user.type)) {
        await this.joinToBucket(bucket, user);

        return bucket;
      }
    }

    const bucket = await this.create(eventDto);
    await this.joinToBucket(bucket, user);

    return bucket;
  }

  async joinToBucket(
    bucket: BucketDocument,
    user: UserDocument,
  ): Promise<void> {
    --bucket.availability[user.type.toLowerCase()];

    bucket.users.push(user.id);
    await bucket.save();

    user.buckets.push(bucket.id);
    await user.save();
  }

  private isUserJoined(bucket: BucketDocument, user: UserDocument): boolean {
    return user.buckets.includes(bucket.id);
  }

  private isBucketAvailable(
    bucket: BucketDocument,
    type: UserTypeEnum,
  ): boolean {
    return bucket.availability[type.toLowerCase()] > 0;
  }
}
