import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsOptional,
  IsArray,
  IsInt,
} from 'class-validator';
import { EventStatus } from 'src/common/entities/organizer-entities/enums/eventStatus.enum';
import { EventCategory } from 'src/common/entities/organizer-entities/enums/eventCategory.enum';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  eventTitle: string;

  @IsString()
  @IsNotEmpty()
  eventDescription: string;

  @IsDateString()
  eventDate: string;

  @IsString()
  @IsNotEmpty()
  eventTime: string;

  @IsString()
  @IsNotEmpty()
  eventLocation: string;

  @IsEnum(EventCategory)
  @IsOptional()
  eventCategory: EventCategory;

  @IsEnum(EventStatus)
  @IsOptional()
  eventStatus: EventStatus;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  attendeeIds?: number[];
}
