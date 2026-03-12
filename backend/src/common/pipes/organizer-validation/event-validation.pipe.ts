import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { EventCategory } from 'src/common/entities/organizer-entities/enums/eventCategory.enum';
import { EventStatus } from 'src/common/entities/organizer-entities/enums/eventStatus.enum';

@Injectable()
export class EventValidationPipe implements PipeTransform {
    transform(value: any) {
        if (!value || typeof value !== 'object') {
            throw new BadRequestException('Invalid request body');
        }

        const {
            eventTitle,
            eventDescription,
            eventDate,
            eventTime,
            eventLocation,
            eventCategory,
            eventStatus,
        } = value;

        // eventTitle
        if (
            !eventTitle ||
            typeof eventTitle !== 'string' ||
            eventTitle.trim().length < 3
        ) {
            throw new BadRequestException(
                'Event title must be at least 3 characters long',
            );
        }
        value.eventTitle = eventTitle.trim();

        // eventDescription
        if (
            !eventDescription ||
            typeof eventDescription !== 'string' ||
            eventDescription.trim().length < 5
        ) {
            throw new BadRequestException(
                'Event description must be at least 5 characters long',
            );
        }
        value.eventDescription = eventDescription.trim();

        // eventDate
        const date = new Date(eventDate);
        if (!eventDate || isNaN(date.getTime())) {
            throw new BadRequestException('Invalid eventDate (date required)');
        }
        value.eventDate = date;

        // eventTime
        if (
            !eventTime ||
            typeof eventTime !== 'string' ||
            !/^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i.test(eventTime)
        ) {
            throw new BadRequestException('Invalid eventTime (format HH:MM AM/PM)');
        }
        value.eventTime = eventTime;


        // eventLocation
        if (
            !eventLocation ||
            typeof eventLocation !== 'string' ||
            eventLocation.trim().length < 3
        ) {
            throw new BadRequestException(
                'Event location must be at least 3 characters long',
            );
        }
        value.eventLocation = eventLocation.trim();

        // Event category
        if (eventCategory !== undefined) {
            const validCategories = Object.values(EventCategory);
            if (!eventCategory || typeof eventCategory !== 'string' || !validCategories.includes(eventCategory as EventCategory)) {
                throw new BadRequestException(`Invalid category. Allowed: ${validCategories.join(', ')}`);
            }
            value.eventCategory = eventCategory;
        }

        // Event status
        if (eventStatus !== undefined) {
            const validStatuses = Object.values(EventStatus);
            if (!eventStatus || typeof eventStatus !== 'string' || !validStatuses.includes(eventStatus as EventStatus)) {
                throw new BadRequestException(`Invalid status. Allowed: ${validStatuses.join(', ')}`);
            }
            value.eventStatus = eventStatus;
        }

        return value;
    }
}
