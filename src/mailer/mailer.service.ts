import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailerService {
  private mailer: Resend;

  constructor(private readonly configService: ConfigService) {
    this.mailer = new Resend(configService.get('MAILER_API_KEY'));
  }

  sendEmail(to: string, subject: string) {
    // TODO Install react mailer To select template
    this.mailer.emails.send({
      from: this.configService.get('MAILER_MAIL_ADDRESS'),
      to,
      subject,
      html: '<p>HOPP on sending your <strong>first email</strong>!</p>',
    });
  }
}
