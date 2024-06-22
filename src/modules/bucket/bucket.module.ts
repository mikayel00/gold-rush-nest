import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bucket, BucketSchema } from './schemas/bucket.schema';
import { BucketService } from './bucket.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bucket.name, schema: BucketSchema }]),
  ],
  providers: [BucketService],
  exports: [BucketService],
})
export class BucketModule {}
