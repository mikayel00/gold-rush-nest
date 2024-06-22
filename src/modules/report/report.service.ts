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
    const eventDto = await this.eventService.getByStatus({
      status: EventStatusEnum.ACTIVE,
    });

    if (eventDto.id !== reportOptionsDto.eventId) {
      return;
    }

    const user = await this.userService.getOneByEmail(userEmail);

    const availableBucket = await this.bucketService.getAvailable(
      eventDto,
      user,
    );

    console.log(availableBucket);

    return this.upsert(reportOptionsDto, userEmail);
  }

  private async upsert(
    reportOptionsDto: ReportOptionsDto,
    userEmail: string,
  ): Promise<ReportDto> {
    const reportEntity = await this.reportModel
      .findOneAndUpdate(
        {
          eventId: reportOptionsDto.eventId,
          userEmail: userEmail,
        },
        { score: reportOptionsDto.score },
        { new: true, upsert: true },
      )
      .exec();

    return new ReportDto(reportEntity);
  }
}
