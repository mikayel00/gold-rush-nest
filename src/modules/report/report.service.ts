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
import { EventDocument } from '../event/event.schema';

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
    const eventDto = await this.eventService.getById(reportOptionsDto.eventId);

    if (eventDto.status !== EventStatusEnum.ACTIVE) {
      return;
    }

    const user = await this.userService.getOneByEmail(userEmail);

    const availableBucket = await this.bucketService.getAvailable(
      eventDto,
      user,
    );

    const report = await this.upsert(reportOptionsDto, userEmail, eventDto);

    await this.bucketService.addReportToBucket(availableBucket, report);

    return new ReportDto(report);
  }

  private async upsert(
    reportOptionsDto: ReportOptionsDto,
    userEmail: string,
    event: EventDocument,
  ): Promise<ReportDocument> {
    return this.reportModel
      .findOneAndUpdate(
        {
          eventId: reportOptionsDto.eventId,
          userEmail: userEmail,
        },
        { score: reportOptionsDto.score, eventId: event.id },
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
