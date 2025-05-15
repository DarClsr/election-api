// redis.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  // 设置值（支持过期时间）
  async set(key: string, value: string | number, ttl?: number) {
    if (ttl) {
      // 如果提供了过期时间，则使用 setex
      await this.redis.setex(key, ttl, value);
    } else {
      // 否则直接设置
      await this.redis.set(key, value);
    }
  }

  // 获取值
  async get(key: string) {
    return await this.redis.get(key);
  }

  // 删除值
  async del(key: string) {
    await this.redis.del(key);
  }
}
