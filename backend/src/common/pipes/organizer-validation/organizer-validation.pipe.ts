import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Gender } from 'src/common/entities/organizer-entities/enums/gender.enum';

@Injectable()
export class OrganizerValidationPipe implements PipeTransform {
    transform(value: any) {
        if (!value || typeof value !== 'object') {
            throw new BadRequestException('Invalid request body');
        }

        const {
            organizerName,
            organizerEmail,
            organizerPhone,
            organizerGender,
            organizerDob,
            organizerJoiningDate,
            organizerPassword,
        } = value;

        // organizerName
        if (!organizerName || typeof organizerName !== 'string' || organizerName.trim().length < 3) {
            throw new BadRequestException('Organizer name must be at least 3 characters long');
        }

        // organizerEmail
        if (
            !organizerEmail ||
            typeof organizerEmail !== 'string' ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(organizerEmail)
        ) {
            throw new BadRequestException('Invalid organizer email format');
        }

        value.organizerEmail = organizerEmail.trim(); // Database will not receive extra space

        // organizerPhone
        if (!organizerPhone || typeof organizerPhone !== 'string') {
            throw new BadRequestException('Organizer phone is required');
        }
        const phone = organizerPhone.replace(/\s+/g, ''); // To remove white space, tab
        if (!/^\+?\d{10,15}$/.test(phone)) {
            throw new BadRequestException('Invalid organizer phone number');
        }
        value.organizerPhone = phone;

        // organizerGender (enum check)
        const genderValues = Object.values(Gender);
        if (!organizerGender || !genderValues.includes(organizerGender)) {
            throw new BadRequestException(`Organizer gender must be one of: ${genderValues.join(', ')}`);
        }

        // DoB
        // const dob = new Date(organizerDob);
        // if (!organizerDob || isNaN(dob.getTime())) {
        //     throw new BadRequestException('Invalid organizerDob (date required)');
        // }
        // if (dob > new Date()) {
        //     throw new BadRequestException('organizerDob cannot be a future date');
        // }

        // DoB
        const dob = new Date(organizerDob);
        if (!organizerDob || isNaN(dob.getTime())) {
            throw new BadRequestException('Invalid organizerDob (date required)');
        }

        const today = new Date();

        // future date check
        if (dob > today) {
            throw new BadRequestException('organizerDob cannot be a future date');
        }

        // age calculation (18+)
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < dob.getDate())
        ) {
            age--;
        }

        if (age < 18) {
            throw new BadRequestException('Organizer must be at least 18 years old');
        }

        // Joining Date
        const joining = new Date(organizerJoiningDate);
        if (!organizerJoiningDate || isNaN(joining.getTime())) {
            throw new BadRequestException('Invalid organizerJoiningDate (date required)');
        }
        if (joining < dob) {
            throw new BadRequestException('Organizer Joining Date cannot be before organizerDob');
        }

        // organizerPassword
        if (!organizerPassword || typeof organizerPassword !== 'string' || organizerPassword.length < 6) {
            throw new BadRequestException('Password must be at least 6 characters long');
        }

        return value;
    }
}
