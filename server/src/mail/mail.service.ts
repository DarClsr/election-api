import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationCode(email: string, code: number) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '邮箱验证码 - 账户验证',
        text: `您的验证码是：${code}\n\n该验证码${process.env.VERIFICATION_CODE_EXPIRE_TIME || '10分钟'}内有效。`,
      });
      return true;
    } catch (error) {
        console.log(error)
      throw new Error('邮件发送失败');
    }
  }
}  