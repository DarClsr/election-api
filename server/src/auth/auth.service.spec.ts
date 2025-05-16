import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@m8a/nestjs-typegoose';
import { User } from 'src/db/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { MailService } from 'src/mail/mail.service';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserModel: any;
  let mockRedisService: any;
  let mockMailService: any;
  let mockJwtService: any;
  let module: TestingModule;
  let consoleSpy: jest.SpyInstance;

  beforeEach(async () => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    mockUserModel = {
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      create: jest.fn(),
    };

    mockRedisService = {
      get: jest.fn(),
      set: jest.fn(),
    };

    mockMailService = {
      sendVerificationCode: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock.jwt.token'),
    };

    module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    consoleSpy.mockRestore();
    await module.close();
    await new Promise(resolve => setTimeout(resolve, 100)); // 等待所有异步操作完成
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const email = 'test@example.com';
      const code = '123456';
      const password = 'password123';

      mockRedisService.get.mockResolvedValue(code);
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue({
        email,
        password,
        role: 'user',
      });

      const result = await service.register(email, code, password);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(email);
    });

    it('should throw error if verification code is incorrect', async () => {
      const email = 'test@example.com';
      const code = '123456';
      
      mockRedisService.get.mockResolvedValue('different-code');

      await expect(service.register(email, code)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if email already exists', async () => {
      const email = 'test@example.com';
      const code = '123456';
      
      mockRedisService.get.mockResolvedValue(code);
      mockUserModel.findOne.mockResolvedValue({ email });

      await expect(service.register(email, code)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          email,
          password: hashedPassword,
          role: 'user',
        }),
      });

      const result = await service.login(email, password);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(email);
    });

    it('should throw error if user not found', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(service.login(email, password)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash('different-password', 10);

      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          email,
          password: hashedPassword,
          role: 'user',
        }),
      });

      await expect(service.login(email, password)).rejects.toThrow(BadRequestException);
    });
  });

  describe('sendVerificationCode', () => {
    it('should send verification code successfully', async () => {
      const email = 'test@example.com';
      
      mockRedisService.get.mockResolvedValue(null);
      mockUserModel.findOne.mockResolvedValue(null);
      mockMailService.sendVerificationCode.mockResolvedValue(true);

      await service.sendVerificationCode(email);

      expect(mockMailService.sendVerificationCode).toHaveBeenCalled();
      expect(mockRedisService.set).toHaveBeenCalled();
    });

    it('should throw error if code was already sent', async () => {
      const email = 'test@example.com';
      
      mockRedisService.get.mockResolvedValue('123456');

      await expect(service.sendVerificationCode(email)).rejects.toThrow();
    });

    it('should throw error if email already exists', async () => {
      const email = 'test@example.com';
      
      mockRedisService.get.mockResolvedValue(null);
      mockUserModel.findOne.mockResolvedValue({ email });

      await expect(service.sendVerificationCode(email)).rejects.toThrow(BadRequestException);
    });
  });
});
