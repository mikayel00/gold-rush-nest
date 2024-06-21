import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth-guard';
import { ReportService } from './report.service';
import { AuthUser } from '../../decorators';
import { UserDto } from '../user/dto/user.dto';
import { ReportOptionsDto } from './dto/report-options.dto';
import { ReportDto } from './dto/report.dto';

@ApiTags('report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Update or insert report by EventId',
  })
  upsert(
    @AuthUser() userDto: UserDto,
    @Body() reportOptionsDto: ReportOptionsDto,
  ): Promise<ReportDto> {
    return this.reportService.upsert(reportOptionsDto, userDto.email);
  }
}
