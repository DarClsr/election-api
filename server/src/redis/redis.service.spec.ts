import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { Redis } from 'ioredis';
import { RedisModule } from '@nestjs-modules/ioredis';

describe('RedisService', () => {
  let service: RedisService;
  let mockRedisClient: jest.Mocked<Partial<Redis>>;
  let module: TestingModule;

  beforeEach(async () => {
    mockRedisClient = {
      get: jest.fn(),
      set: jest.fn(),
      setex: jest.fn(),
      del: jest.fn(),
      disconnect: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [
        RedisModule.forRoot({
          type: 'single',
          url: 'redis://localhost:6379',
        }),
      ],
      providers: [RedisService],
    })
      .overrideProvider('default_IORedisModuleConnectionToken')
      .useValue(mockRedisClient)
      .compile();

    module = moduleRef;
    service = module.get<RedisService>(RedisService);
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
    if (mockRedisClient.disconnect) {
      await mockRedisClient.disconnect();
    }
    jest.clearAllMocks();
    await new Promise((resolve) => setTimeout(resolve, 100)); // 等待所有异步操作完成
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should get value from redis', async () => {
      const key = 'test-key';
      const value = 'test-value';
      mockRedisClient.get!.mockResolvedValue(value);

      const result = await service.get(key);

      expect(mockRedisClient.get).toHaveBeenCalledWith(key);
      expect(result).toBe(value);
    });
  });

  describe('set', () => {
    it('should set value in redis with TTL', async () => {
      const key = 'test-key';
      const value = 'test-value';
      const ttlInSeconds = 300; // 5分钟 = 300秒
      mockRedisClient.setex!.mockResolvedValue('OK');

      await service.set(key, value, ttlInSeconds);

      expect(mockRedisClient.setex).toHaveBeenCalledWith(
        key,
        ttlInSeconds,
        value,
      );
    });

    it('should set value in redis without TTL', async () => {
      const key = 'test-key';
      const value = 'test-value';
      mockRedisClient.set!.mockResolvedValue('OK');

      await service.set(key, value);

      expect(mockRedisClient.set).toHaveBeenCalledWith(key, value);
    });
  });

  describe('del', () => {
    it('should delete key from redis', async () => {
      const key = 'test-key';
      mockRedisClient.del!.mockResolvedValue(1);

      await service.del(key);

      expect(mockRedisClient.del).toHaveBeenCalledWith(key);
    });
  });
});
