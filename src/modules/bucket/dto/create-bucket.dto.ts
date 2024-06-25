import { IsMongoId, IsNotEmpty } from '@nestjs/class-validator';

export class CreateBucketDto {
  @IsNotEmpty()
  @IsMongoId()
  eventId: string;
}
