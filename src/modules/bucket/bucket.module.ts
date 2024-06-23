import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bucket, BucketSchema } from './schemas/bucket.schema';
import { BucketService } from './bucket.service';
import { BucketController } from './bucket.controller';
import { EventModule } from '../event/event.module';

@Module({
  imports: [
    EventModule,
    MongooseModule.forFeature([{ name: Bucket.name, schema: BucketSchema }]),
  ],
  controllers: [BucketController],
  providers: [BucketService],
  exports: [BucketService],
})
export class BucketModule {}
