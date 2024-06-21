import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from './report.schema';
import { ReportDto } from './dto/report.dto';
import { ReportNotFoundException } from './exceptions/report-not-found.exception';
import { ReportOptionsDto } from './dto/report-options.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name)
    private readonly reportModel: Model<ReportDocument>,
    private readonly userService: UserService,
  ) {}

  async upsert(
    reportOptionsDto: ReportOptionsDto,
    userEmail: string,
  ): Promise<ReportDto | null> {
    const user = await this.userService.getOneByEmail(userEmail);

    const reportEntity = await this.reportModel
      .findOneAndUpdate(
        {
          eventId: reportOptionsDto.eventId,
          userEmail: userEmail,
        },
        { score: reportOptionsDto.score,user: user },
        { new: true, upsert: true },
      )
      .exec();

    if (!reportEntity) {
      throw new ReportNotFoundException();
    }
    return new ReportDto(reportEntity);
  }
}
