import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { Gender } from 'src/common/entities/organizer-entities/enums/gender.enum';

export class UpdateOrganizerDto {
    @IsOptional()
    @IsString()
    organizerName?: string;

    @IsOptional()
    @IsString()
    organizerPhone?: string;

    @IsOptional()
    @IsEnum(Gender)
    organizerGender?: Gender;

    @IsOptional()
    @IsDateString()
    organizerDob?: Date;

}
