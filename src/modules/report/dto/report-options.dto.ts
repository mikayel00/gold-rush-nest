import { IsMongoId, IsNotEmpty, IsNumber } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReportOptionsDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty()
  eventId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  score: number;
}
