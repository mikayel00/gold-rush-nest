import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from '@nestjs/class-validator';
import { AbstractDto } from '../../../common/abstract.dto';
import { UserTypeEnum } from '../../../constants';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.schema';

export class UserDto extends AbstractDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsEnum(UserTypeEnum)
  @IsNotEmpty()
  @ApiProperty()
  type: UserTypeEnum;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  points: number;

  constructor(userEntity: User) {
    super(userEntity);

    this.fullName = userEntity.fullName;
    this.email = userEntity.email;
    this.type = userEntity.type;
    this.points = userEntity.points;
  }
}
