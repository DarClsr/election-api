import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let module: TestingModule;

  const mockAuthService = {
    sendVerificationCode: jest.fn(),
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendCode', () => {
    it('should send verification code', async () => {
      const query = { email: 'test@example.com' };
      mockAuthService.sendVerificationCode.mockResolvedValue(undefined);

      await controller.sendCode(query);

      expect(service.sendVerificationCode).toHaveBeenCalledWith(query.email);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = {
        email: 'test@example.com',
        code: '123456',
        password: 'password123',
      };

      const expectedResponse = {
        user: {
          email: dto.email,
          role: 'user',
        },
        token: 'jwt.token.here',
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(dto);

      expect(service.register).toHaveBeenCalledWith(
        dto.email,
        dto.code,
        dto.password,
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResponse = {
        user: {
          email: dto.email,
          role: 'user',
        },
        token: 'jwt.token.here',
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(dto);

      expect(service.login).toHaveBeenCalledWith(dto.email, dto.password);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getUserInfo', () => {
    it('should return user info', () => {
      const mockUser = {
        email: 'test@example.com',
        role: 'user',
      };

      const result = controller.getUserInfo(mockUser);

      expect(result).toEqual(mockUser);
    });
  });
});
