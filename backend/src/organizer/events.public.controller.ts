import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { PublicEventsQueryDto } from 'src/common/dto/organizer-dto/event-dto/public-events-query.dto';

@Controller('events')
export class EventsPublicController {
  constructor(private readonly organizerService: OrganizerService) {}

  @Get('public')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getPublicEvents(@Query() q: PublicEventsQueryDto) {
    return this.organizerService.getPublicEvents(q);
  }
}
