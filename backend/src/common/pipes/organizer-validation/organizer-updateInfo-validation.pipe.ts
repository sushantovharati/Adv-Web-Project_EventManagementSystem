import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Gender } from 'src/common/entities/organizer-entities/enums/gender.enum';

@Injectable()
export class UpdateOrganizerValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!value || typeof value !== 'object') {
      throw new BadRequestException('Invalid request body');
    }

    const {
      organizerName,
      organizerPhone,
      organizerGender,
      organizerDob,
    } = value;

    // organizerName (optional)
    if (organizerName !== undefined) {
      if (
        typeof organizerName !== 'string' ||
        organizerName.trim().length < 3
      ) {
        throw new BadRequestException(
          'Organizer name must be at least 3 characters long',
        );
      }
      value.organizerName = organizerName.trim();
    }

    // organizerPhone (optional)
    if (organizerPhone !== undefined) {
      if (typeof organizerPhone !== 'string') {
        throw new BadRequestException('Organizer phone must be a string');
      }

      const phone = organizerPhone.replace(/\s+/g, '');
      if (!/^\+?\d{10,15}$/.test(phone)) {
        throw new BadRequestException('Invalid organizer phone number');
      }
      value.organizerPhone = phone;
    }

    // organizerGender (optional, enum check)
    if (organizerGender !== undefined) {
      const genderValues = Object.values(Gender);
      if (!genderValues.includes(organizerGender)) {
        throw new BadRequestException(
          `Organizer gender must be one of: ${genderValues.join(', ')}`,
        );
      }
    }

    // organizerDob (optional, 18+ check)
    if (organizerDob !== undefined) {
      const dob = new Date(organizerDob);

      if (isNaN(dob.getTime())) {
        throw new BadRequestException('Invalid organizerDob');
      }

      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      if (age < 18) {
        throw new BadRequestException(
          'Organizer must be at least 18 years old',
        );
      }

      value.organizerDob = dob;
    }

    return value;
  }
}
