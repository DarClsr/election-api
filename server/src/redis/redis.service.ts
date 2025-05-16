// redis.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  /**
   * 设置 Redis 键值对
   * @param key - Redis 键
   * @param value - 要存储的值（字符串或数字）
   * @param ttl - 可选的过期时间（单位：秒）
   */
  async set(key: string, value: string | number, ttl?: number) {
    if (ttl) {
      // 如果提供了过期时间（秒），则使用 setex
      await this.redis.setex(key, ttl, value);
    } else {
      // 否则直接设置
      await this.redis.set(key, value);
    }
  }

  /**
   * 获取 Redis 键对应的值
   * @param key - Redis 键
   * @returns 存储的值，如果键不存在则返回 null
   */
  async get(key: string) {
    return await this.redis.get(key);
  }

  /**
   * 删除 Redis 键
   * @param key - 要删除的 Redis 键
   */
  async del(key: string) {
    await this.redis.del(key);
  }
}
