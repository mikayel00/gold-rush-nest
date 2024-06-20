import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventStatusEnum } from '../../../constants';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsEnum(EventStatusEnum)
  @ApiProperty()
  status: EventStatusEnum;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  endDate: Date;
}
