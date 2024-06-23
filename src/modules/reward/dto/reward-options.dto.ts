import { IsMongoId, IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RewardOptionsDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty()
  eventId: string;
}
