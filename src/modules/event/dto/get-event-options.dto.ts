import { IsEnum, IsNotEmpty } from '@nestjs/class-validator';
import { EventStatusEnum } from '../../../constants';
import { ApiProperty } from '@nestjs/swagger';

export class GetEventOptionsDto {
  @IsNotEmpty()
  @IsEnum(EventStatusEnum)
  @ApiProperty()
  status: EventStatusEnum;
}
