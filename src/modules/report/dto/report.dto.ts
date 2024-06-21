import { IsMongoId, IsNotEmpty, IsNumber } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Report } from '../report.schema';
import { AbstractDto } from '../../../common/abstract.dto';

export class ReportDto extends AbstractDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  eventId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  score: number;

  constructor(entity: Report) {
    super(entity);
    this.eventId = entity.eventId;
    this.score = entity.score;
  }
}
