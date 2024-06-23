import { BadRequestException, Injectable } from '@nestjs/common';
import { EventNotFoundException } from '../event/exceptions/event-not-found.exception';
import { ReportService } from '../report/report.service';
import { RewardOptionsDto } from './dto/reward-options.dto';
import { UserDto } from '../user/dto/user.dto';
import { ReportDto } from '../report/dto/report.dto';
import { EventService } from '../event/event.service';
import { EventStatusEnum } from '../../constants';
import { EventNotFinishedException } from '../event/exceptions/event-not-finished.exception';
import { BucketService } from '../bucket/bucket.service';
import { UserService } from '../user/user.service';

@Injectable()
export class RewardService {
  constructor(
    private readonly reportService: ReportService,
    private readonly eventService: EventService,
    private readonly bucketService: BucketService,
    private readonly userService: UserService,
  ) {}

  async getReward(
    rewardOptionsDto: RewardOptionsDto,
    userDto: UserDto,
  ): Promise<ReportDto> {
    const event = await this.eventService.getById(rewardOptionsDto.eventId);

    if (event.status !== EventStatusEnum.FINISHED) {
      throw new EventNotFinishedException();
    }

    const bucket = await this.bucketService.getCurrent(
      rewardOptionsDto,
      userDto,
    );

    if (!bucket) {
      throw new BadRequestException();
    }

    let scoreIndex = 0;

    bucket.scores.map((score, index) => {
      if (score.userEmail === userDto.email) {
        scoreIndex = index;
      }
    });

    const reportEntity = await this.reportService.getByEventId(
      rewardOptionsDto,
      userDto,
    );

    if (!reportEntity) {
      throw new EventNotFoundException();
    }

    return new ReportDto(reportEntity, { reward: 200 - (scoreIndex + 1) });
  }

  async claimReward(
    rewardOptionsDto: RewardOptionsDto,
    userDto: UserDto,
  ): Promise<ReportDto> {
    const reward = await this.getReward(rewardOptionsDto, userDto);

    if (!reward) {
      throw new BadRequestException();
    }

    await this.userService.addPoints(userDto.email, reward.reward);

    await this.reportService.deleteById(reward.id);

    return reward;
  }
}
