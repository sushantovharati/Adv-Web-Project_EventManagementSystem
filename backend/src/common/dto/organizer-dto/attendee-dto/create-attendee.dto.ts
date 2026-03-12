import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';

import { AttendeeRole } from 'src/common/entities/organizer-entities/enums/attendeeRole.enum';
import { Gender } from 'src/common/entities/organizer-entities/enums/gender.enum';
import { AttendeeStatus } from 'src/common/entities/organizer-entities/enums/attendeeStatus.enum';

export class CreateAttendeeDto {
    @IsString()
    @IsNotEmpty()
    attendeeName: string;

    @IsEmail()
    @IsNotEmpty()
    attendeeEmail: string;

    @IsString()
    @IsNotEmpty()
    attendeePhone: string;

    @IsEnum(Gender)
    @IsNotEmpty()
    attendeeGender: Gender;

    @IsEnum(AttendeeRole)
    @IsOptional() // default = STUDENT
    attendeeRole?: AttendeeRole;

    @IsEnum(AttendeeStatus)
    @IsOptional() // default = ACTIVE
    attendeeStatus?: AttendeeStatus;
}
