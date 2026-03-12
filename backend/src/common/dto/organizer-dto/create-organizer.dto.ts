import { IsString, IsEmail, IsDateString, IsNotEmpty, IsEnum } from 'class-validator';
import { Gender } from 'src/common/entities/organizer-entities/enums/gender.enum';

export class CreateOrganizerDto {
    @IsString()
    @IsNotEmpty()
    organizerName: string;

    @IsEmail()
    organizerEmail: string;

    @IsString()
    organizerPhone: string;

    @IsEnum(Gender)
    organizerGender: Gender;

    @IsDateString()
    organizerDob: Date;

    @IsDateString()
    organizerJoiningDate: Date;

    @IsString()
    @IsNotEmpty()
    organizerPassword: string;
}
