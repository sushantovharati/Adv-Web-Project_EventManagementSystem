import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async sendAttendeeWelcome(to: string, name: string) {
    console.log('Sending mail to:', to);
    return this.mailer.sendMail({
      to,
      subject: 'Welcome to CampusEvents!',
      text: `Hi ${name},\n\nYou have been added as an attendee in CampusEvents.\n\nThanks!`,
    });
  }
}
