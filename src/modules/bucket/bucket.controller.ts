import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BucketService } from './bucket.service';
import { JwtAuthGuard } from '../../guards/jwt-auth-guard';
import { BucketDocument } from './schemas/bucket.schema';
import { AuthUser } from '../../decorators';
import { UserDto } from '../user/dto/user.dto';
import { BucketOptionsDto } from './dto/bucket-options.dto';

@ApiTags('bucket')
@Controller('bucket')
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get leaderboard by bucketId',
  })
  @ApiOperation({
    summary: 'Get leaderboard by bucketId in bucket object',
  })
  getLeaderboard(@Param('id') id: string): Promise<BucketDocument> {
    return this.bucketService.getLeaderboard(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get current bucket',
  })
  @ApiOperation({
    summary: 'Get current bucket where user is joined',
  })
  getCurrent(
    @Query() bucketOptionsDto: BucketOptionsDto,
    @AuthUser() userDto: UserDto,
  ): Promise<BucketDocument> {
    return this.bucketService.getCurrent(bucketOptionsDto, userDto);
  }
}
