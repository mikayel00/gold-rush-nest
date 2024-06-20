import { AbstractDto } from '../../../common/abstract.dto';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventStatusEnum } from '../../../constants';
import { Event } from '../event.schema';

export class EventDto extends AbstractDto {
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

  constructor(entity: Event) {
    super(entity);

    this.name = entity.name;
    this.status = entity.status;
    this.startDate = entity.startDate;
    this.endDate = entity.endDate;
  }
}
