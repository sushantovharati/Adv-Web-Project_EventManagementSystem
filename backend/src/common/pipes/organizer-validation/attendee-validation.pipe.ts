import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Gender } from 'src/common/entities/organizer-entities/enums/gender.enum';
import { AttendeeRole } from 'src/common/entities/organizer-entities/enums/attendeeRole.enum';
import { AttendeeStatus } from 'src/common/entities/organizer-entities/enums/attendeeStatus.enum';

@Injectable()
export class AttendeeValidationPipe implements PipeTransform {
    transform(value: any) {
        if (!value || typeof value !== 'object') {
            throw new BadRequestException('Invalid request body');
        }

        const {
            attendeeName,
            attendeeEmail,
            attendeePhone,
            attendeeGender,
            attendeeRole,
            attendeeStatus,
        } = value;

        // attendeeName
        if (
            !attendeeName ||
            typeof attendeeName !== 'string' ||
            attendeeName.trim().length < 3
        ) {
            throw new BadRequestException(
                'Attendee name must be at least 3 characters long',
            );
        }
        value.attendeeName = attendeeName.trim();

        // attendeeEmail
        if (
            !attendeeEmail ||
            typeof attendeeEmail !== 'string' ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendeeEmail)
        ) {
            throw new BadRequestException('Invalid attendee email format');
        }
        value.attendeeEmail = attendeeEmail.trim();

        // attendeePhone 
        if (!attendeePhone || typeof attendeePhone !== 'string') {
            throw new BadRequestException('Attendee phone is required');
        }
        const phone = attendeePhone.replace(/\s+/g, '');
        if (!/^\+?\d{10,15}$/.test(phone)) {
            throw new BadRequestException('Invalid attendee phone number');
        }
        value.attendeePhone = phone;

        // attendeeGender enum check
        const genderValues = Object.values(Gender);
        if (!attendeeGender || !genderValues.includes(attendeeGender)) {
            throw new BadRequestException(
                `Attendee gender must be one of: ${genderValues.join(', ')}`,
            );
        }

        // attendeeRole enum check
        if (attendeeRole !== undefined && attendeeRole !== null) {
            const roleValues = Object.values(AttendeeRole);
            if (!roleValues.includes(attendeeRole)) {
                throw new BadRequestException(
                    `Attendee role must be one of: ${roleValues.join(', ')}`,
                );
            }
        }

        // attendeeStatus enum check
        const statusValues = Object.values(AttendeeStatus);
        if (!attendeeStatus || !statusValues.includes(attendeeStatus)) {
            throw new BadRequestException(
                `Attendee status must be one of: ${statusValues.join(', ')}`,
            );
        }

        return value;
    }
}
