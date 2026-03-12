import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { AttendeeRole } from 'src/common/entities/organizer-entities/enums/attendeeRole.enum';
import { Gender } from 'src/common/entities/organizer-entities/enums/gender.enum';
import { AttendeeStatus } from 'src/common/entities/organizer-entities/enums/attendeeStatus.enum';

export class UpdateAttendeeDto {
    @IsOptional()
    @IsString()
    attendeeName?: string;

    @IsOptional()
    @IsEmail()
    attendeeEmail?: string;

    @IsOptional()
    @IsString()
    attendeePhone?: string;

    @IsOptional()
    @IsEnum(Gender)
    attendeeGender?: Gender;

    @IsOptional()
    @IsEnum(AttendeeRole)
    attendeeRole?: AttendeeRole;

    @IsOptional()
    @IsEnum(AttendeeStatus)
    attendeeStatus?: AttendeeStatus;
}
