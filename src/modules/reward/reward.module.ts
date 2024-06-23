import { Module } from '@nestjs/common';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';
import { ReportModule } from '../report/report.module';
import { EventModule } from '../event/event.module';
import { BucketModule } from '../bucket/bucket.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ReportModule, EventModule, BucketModule, UserModule],
  controllers: [RewardController],
  providers: [RewardService],
})
export class RewardModule {}
