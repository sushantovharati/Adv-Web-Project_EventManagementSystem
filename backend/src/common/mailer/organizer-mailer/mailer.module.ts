import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mailer.service';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const user = config.get<string>('MAIL_USER');
        const pass = config.get<string>('MAIL_PASS');

        //console.log('MAIL ENV (ConfigService) =>', user, pass);

        return {
          transport: {
            host: config.get<string>('MAIL_HOST', 'smtp.gmail.com'),
            port: Number(config.get<number>('MAIL_PORT', 587)),
            secure: false,
            auth: { user, pass },
          },
          defaults: {
            from: config.get<string>('MAIL_FROM') || user,
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class AppMailerModule {}
