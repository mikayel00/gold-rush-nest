import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth-guard';
import { AuthUser } from '../../decorators';
import { UserDto } from '../user/dto/user.dto';
import { RewardOptionsDto } from './dto/reward-options.dto';
import { RewardService } from './reward.service';
import { ReportDto } from '../report/dto/report.dto';

@ApiTags('reward')
@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get finished event reward',
  })
  @ApiOperation({
    summary: 'Get finished event reward',
  })
  getReward(
    @Query() rewardOptionsDto: RewardOptionsDto,
    @AuthUser() userDto: UserDto,
  ): Promise<ReportDto> {
    return this.rewardService.getReward(rewardOptionsDto, userDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Claim finished event reward',
  })
  @ApiOperation({
    summary: 'Claim finished event reward',
  })
  claimReward(
    @Body() rewardOptionsDto: RewardOptionsDto,
    @AuthUser() userDto: UserDto,
  ): Promise<ReportDto> {
    return this.rewardService.claimReward(rewardOptionsDto, userDto);
  }
}
