import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizerController } from './organizer.controller';
import { OrganizerService } from './organizer.service';
import { OrganizerEntity } from 'src/common/entities/organizer-entities/organizer.entity';
import { EventEntity } from 'src/common/entities/organizer-entities/event.entity';
import { AttendeeEntity } from 'src/common/entities/organizer-entities/attendee.entity';
import { OrganizerAuthModule } from 'src/common/auth/organizer-auth/auth.module';
import { AppMailerModule } from 'src/common/mailer/organizer-mailer/mailer.module';
import { OrganizerPusherModule } from 'src/common/pusher/organizer-pusher/organizer-pusher.module';
import { EventsPublicController } from './events.public.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizerEntity, EventEntity, AttendeeEntity]),
    OrganizerAuthModule, // provides JwtStrategy + JwtModule
    AppMailerModule,
     OrganizerPusherModule,
  ],
  controllers: [OrganizerController, EventsPublicController],
  providers: [OrganizerService],
  exports: [OrganizerService],
})
export class OrganizerModule {}
