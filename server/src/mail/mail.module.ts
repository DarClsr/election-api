import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config'; // 引入配置服务
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.163.com',
          secure: true, // 465 端口需启用 SSL
          port: 465,
          auth: {
            user: config.get('EMAIL_USER'), // 通过 ConfigService 获取
            pass: config.get('EMAIL_PASS'), // 通过 ConfigService 获取
          },
        },
        defaults: {
          from: `"投票吧！" <${config.get('EMAIL_USER')}>`,
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}