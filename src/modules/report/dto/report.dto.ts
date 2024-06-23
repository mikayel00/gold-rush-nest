import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Report } from '../report.schema';
import { AbstractDto } from '../../../common/abstract.dto';

export type UserReward = Partial<{ reward: number }>;

export class ReportDto extends AbstractDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  eventId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  score: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  reward: number;

  constructor(entity: Report, options?: UserReward) {
    super(entity);
    this.eventId = entity.eventId;
    this.score = entity.score;
    if (options?.reward) {
      this.reward = options.reward;
    }
  }
}
