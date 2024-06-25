import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth-guard';
import { EventDto } from './dto/event.dto';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventStatusEnum } from '../../constants';

@ApiTags('event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get current event',
  })
  @ApiOperation({
    summary: 'Get current event',
  })
  getCurrent(): Promise<EventDto> {
    return this.eventService.getByStatus({ status: EventStatusEnum.ACTIVE });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Create event, use UTC time for start and end dates',
  })
  @ApiOperation({
    summary: 'Create event',
  })
  create(@Body() createEventDto: CreateEventDto): Promise<EventDto> {
    return this.eventService.create(createEventDto);
  }
}
