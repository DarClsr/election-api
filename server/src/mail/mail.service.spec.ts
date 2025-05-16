import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('MailService', () => {
  let service: MailService;
  let mockMailerService: any;
  let module: TestingModule;
  let consoleSpy: jest.SpyInstance;

  beforeEach(async () => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    mockMailerService = {
      sendMail: jest.fn(),
    };

    module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    consoleSpy.mockRestore();
    await module.close();
    await new Promise((resolve) => setTimeout(resolve, 100)); // 等待所有异步操作完成
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationCode', () => {
    it('should send verification code email', async () => {
      const email = 'test@example.com';
      const code = 123456;
      mockMailerService.sendMail.mockResolvedValue(true);

      await service.sendVerificationCode(email, code);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: '邮箱验证码 - 账户验证',
        text: `您的验证码是：${code}\n\n该验证码10分钟内有效。`,
      });
    });

    it('should handle email sending failure', async () => {
      const email = 'test@example.com';
      const code = 123456;
      mockMailerService.sendMail.mockRejectedValue(
        new Error('Failed to send email'),
      );

      await expect(service.sendVerificationCode(email, code)).rejects.toThrow(
        '邮件发送失败',
      );
    });
  });
});
