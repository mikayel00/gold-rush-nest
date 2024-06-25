import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class TokenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  token!: string;

  constructor(token: string) {
    this.token = token;
  }
}
