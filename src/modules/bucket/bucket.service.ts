import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bucket, BucketDocument } from './schemas/bucket.schema';
import { UserDocument } from '../user/user.schema';
import { UserTypeEnum } from '../../constants';
import { ReportDocument } from '../report/report.schema';
import { EventDocument } from '../event/event.schema';
import { BucketOptionsDto } from './dto/bucket-options.dto';
import { UserDto } from '../user/dto/user.dto';
import { BucketNotFoundException } from './exceptions/bucket-not-found.exception';
import { CreateBucketDto } from './dto/create-bucket.dto';

@Injectable()
export class BucketService {
  constructor(
    @InjectModel(Bucket.name)
    private readonly bucketModel: Model<BucketDocument>,
  ) {}

  async create(createBucketDto: CreateBucketDto): Promise<BucketDocument> {
    const createdBucket = new this.bucketModel(createBucketDto);
    await createdBucket.save();

    return createdBucket;
  }

  async getAvailable(
    event: EventDocument,
    user: UserDocument,
  ): Promise<BucketDocument | null> {
    const buckets = await this.bucketModel
      .find({ eventId: event.id })
      .sort({ createdAt: 'asc' })
      .exec();

    if (!buckets.length) {
      const bucket = await this.create({ eventId: event.id });
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

    const bucket = await this.create({ eventId: event.id });
    await this.joinToBucket(bucket, user);

    return bucket;
  }

  async getLeaderboard(id: string): Promise<BucketDocument> {
    const bucket = await this.bucketModel
      .findById(id)
      .populate('scores')
      .exec();

    if (!bucket) {
      throw new BucketNotFoundException();
    }

    bucket.scores
      .sort((a, b) => {
        return b.score - a.score;
      })
      .map((score, index) => (score.place = index + 1));

    return bucket;
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
    event: EventDocument,
  ): Promise<void> {
    if (bucket.scores.includes(report.id)) return;

    bucket.scores.push(report.id);
    await bucket.save();

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
