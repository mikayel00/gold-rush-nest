import { IsMongoId, IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BucketOptionsDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty()
  eventId: string;
}
