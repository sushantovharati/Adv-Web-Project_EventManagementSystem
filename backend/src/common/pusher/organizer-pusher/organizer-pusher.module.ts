import { Module } from '@nestjs/common';
import { OrganizerPusherService } from './organizer-pusher.service';

@Module({
  providers: [OrganizerPusherService],
  exports: [OrganizerPusherService],
})
export class OrganizerPusherModule {}
