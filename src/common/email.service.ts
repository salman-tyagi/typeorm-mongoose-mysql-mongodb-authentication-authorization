import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';

import { User } from '../users/user.entity';

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}

  sendWelcomeMail({ name, email }: User): Promise<SentMessageInfo> {
    return this.mailService.sendMail({
      to: email,
      subject: 'Welcome to Our App!',
      template: 'welcome.ejs',
      context: {
        name,
      },
    });
  }
}
