import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  IsInt,
} from 'class-validator';
import { EventStatus } from 'src/common/entities/organizer-entities/enums/eventStatus.enum';
import { EventCategory } from 'src/common/entities/organizer-entities/enums/eventCategory.enum';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  eventTitle?: string;

  @IsString()
  @IsOptional()
  eventDescription?: string;

  @IsDateString()
  @IsOptional()
  eventDate?: string;

  @IsString()
  @IsOptional()
  eventTime?: string;

  @IsString()
  @IsOptional()
  eventLocation?: string;

  @IsEnum(EventCategory)
  @IsOptional()
  eventCategory?: EventCategory;

  @IsEnum(EventStatus)
  @IsOptional()
  eventStatus?: EventStatus;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  attendeeIds?: number[];
}
