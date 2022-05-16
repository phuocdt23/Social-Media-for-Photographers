import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import * as hbs from 'nodemailer-express-handlebars';

@Injectable()
export class MailerService {
  private nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "18ee6f0fcd6d45",
        pass: "951eb9110dc7ae"
      },
      logger: false,
    });

    const options = {
      viewEngine: {
        extname: '.hbs', // handlebars extension
        layoutsDir:
          process.cwd() +
          `${this.configService.get<string>('EMAIL_LAYOUT_DIR')}`, // location of handlebars templates
        defaultLayout: `${this.configService.get<string>(
          'EMAIL_DEFAULT_LAYOUT',
        )}`, // name of main template
        partialsDir:
          process.cwd() +
          `${this.configService.get<string>('EMAIL_PARTIAL_DIR')}`, // location of your subtemplates aka. header, footer etc
      },
      viewPath:
        process.cwd() + `${this.configService.get<string>('EMAIL_VIEW_PATH')}`,
      extName: '.hbs',
    };
    this.nodemailerTransport.use('compile', hbs(options));
  }

  sendMail(options: any) {
    return this.nodemailerTransport.sendMail(options);
  }
}
