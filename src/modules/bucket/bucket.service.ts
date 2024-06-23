import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bucket, BucketDocument } from './schemas/bucket.schema';
import { UserDocument } from '../user/user.schema';
import { UserTypeEnum } from '../../constants';
import { ReportDocument } from '../report/report.schema';
import { EventService } from '../event/event.service';
import { EventDocument } from '../event/event.schema';
import { BucketOptionsDto } from './dto/bucket-options.dto';
import { UserDto } from '../user/dto/user.dto';
import { BucketNotFoundException } from './exceptions/bucket-not-found.exception';

@Injectable()
export class BucketService {
  constructor(
    @InjectModel(Bucket.name)
    private readonly bucketModel: Model<BucketDocument>,
    private readonly eventService: EventService,
  ) {}

  async create(event: EventDocument): Promise<BucketDocument> {
    const createdBucket = new this.bucketModel({ eventId: event.id });
    await createdBucket.save();

    return createdBucket;
  }

  async getAvailable(
    eventDto: EventDocument,
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

  async getLeaderboard(id: string): Promise<BucketDocument> {
    const buckets = await this.bucketModel
      .findById(id)
      .populate('scores')
      .exec();

    if (!buckets) {
      throw new BucketNotFoundException();
    }

    buckets.scores
      .sort((a, b) => {
        return b.score - a.score;
      })
      .map((score, index) => (score.place = index + 1));

    return buckets;
  }

  async getCurrent(
    bucketOptionsDto: BucketOptionsDto,
    userDto: UserDto,
  ): Promise<BucketDocument> {
    const bucket = await this.bucketModel
      .findOne({
        eventId: bucketOptionsDto.eventId,
        users: { $in: [userDto.id] },
      })
      .populate('scores')
      .exec();

    bucket.scores
      .sort((a, b) => {
        return b.score - a.score;
      })
      .map((score, index) => (score.place = index + 1));

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

  async addReportToBucket(
    bucket: BucketDocument,
    report: ReportDocument,
  ): Promise<void> {
    if (bucket.scores.includes(report.id)) return;

    bucket.scores.push(report.id);
    await bucket.save();

    const event = await this.eventService.getById(bucket.eventId);
    event.scores.push(report.id);

    await event.save();
  }

  private isBucketAvailable(
    bucket: BucketDocument,
    type: UserTypeEnum,
  ): boolean {
    return bucket.availability[type.toLowerCase()] > 0;
  }

  private isUserJoined(bucket: BucketDocument, user: UserDocument): boolean {
    return user.buckets.includes(bucket.id);
  }
}
