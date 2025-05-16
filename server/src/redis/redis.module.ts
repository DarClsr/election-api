import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisModule as IoRedisModule } from '@nestjs-modules/ioredis';

@Global()
@Module({
  imports: [
    IoRedisModule.forRootAsync({
      useFactory: () => {
        return {
          url: process.env.REDIS_URL,
          type: 'single',
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
