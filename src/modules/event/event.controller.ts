import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
import { EventDto } from './dto/event.dto';
import { EventService } from './event.service';
import { EventOptionsDto } from './dto/event-options.dto';
import { CreateEventDto } from './dto/create-event.dto';

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
  getByStatus(@Query() eventOptionsDto: EventOptionsDto): Promise<EventDto> {
    return this.eventService.getByStatus(eventOptionsDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Create event',
  })
  create(@Body() createEventDto: CreateEventDto): Promise<EventDto> {
    return this.eventService.create(createEventDto);
  }
}
