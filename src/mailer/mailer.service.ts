import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailerService {
  private mailer: Resend;

  constructor(private readonly configService: ConfigService) {
    this.mailer = new Resend(configService.get('MAILER_API_KEY'));
  }

  sendEmail(to: string, subject: string, template?: any, data?: any) {
    // TODO Install react mailer To select template
    const confirmationUrl = `${this.configService.get('ROOT_URL')}/auth/confirm?token=${data.confirmationToken}`;

    this.mailer.emails.send({
      from: this.configService.get('MAILER_MAIL_ADDRESS'),
      to,
      subject,
      html: `Veuillez cliquer sur ce lien pour confirmer votre compte: <a href="${confirmationUrl}">Confirmer</a>`,
    });
  }
}
