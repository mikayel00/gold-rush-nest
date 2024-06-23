import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './report.schema';
import { UserModule } from '../user/user.module';
import { EventModule } from '../event/event.module';
import { BucketModule } from '../bucket/bucket.module';

@Module({
  imports: [
    UserModule,
    EventModule,
    BucketModule,
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
