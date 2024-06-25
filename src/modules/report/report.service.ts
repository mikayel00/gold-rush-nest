import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from './report.schema';
import { ReportDto } from './dto/report.dto';
import { ReportOptionsDto } from './dto/report-options.dto';
import { UserService } from '../user/user.service';
import { EventService } from '../event/event.service';
import { EventStatusEnum } from '../../constants';
import { BucketService } from '../bucket/bucket.service';
import { RewardOptionsDto } from '../reward/dto/reward-options.dto';
import { UserDto } from '../user/dto/user.dto';
import { ReportNotFoundException } from './exceptions/report-not-found.exception';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name)
    private readonly reportModel: Model<ReportDocument>,
    private readonly userService: UserService,
    private readonly eventService: EventService,
    private readonly bucketService: BucketService,
  ) {}

  async report(
    reportOptionsDto: ReportOptionsDto,
    userEmail: string,
  ): Promise<ReportDto> {
    const event = await this.eventService.getById(reportOptionsDto.eventId);

    if (event.status !== EventStatusEnum.ACTIVE) {
      return;
    }

    const user = await this.userService.getOneByEmail(userEmail);

    const availableBucket = await this.bucketService.getAvailable(event, user);

    const report = await this.upsert(reportOptionsDto, userEmail);

    await this.bucketService.addReportToBucket(availableBucket, report, event);

    return new ReportDto(report);
  }

  private async upsert(
    reportOptionsDto: ReportOptionsDto,
    userEmail: string,
  ): Promise<ReportDocument> {
    return this.reportModel
      .findOneAndUpdate(
        {
          eventId: reportOptionsDto.eventId,
          userEmail: userEmail,
        },
        { score: reportOptionsDto.score, eventId: reportOptionsDto.eventId },
        { new: true, upsert: true },
      )
      .exec();
  }

  async getByEventId(
    rewardOptionsDto: RewardOptionsDto,
    userDto: UserDto,
  ): Promise<ReportDocument> {
    const report = await this.reportModel
      .findOne({
        eventId: rewardOptionsDto.eventId,
        userEmail: userDto.email,
      })
      .exec();

    if (!report) {
      throw new ReportNotFoundException();
    }

    return report;
  }

  async deleteById(id: string): Promise<void> {
    await this.reportModel.findByIdAndDelete(id);
  }
}
