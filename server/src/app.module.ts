import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { CandidatesModule } from './candidates/candidates.module';
import { ElectionModule } from './election/election.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { VoteModule } from './vote/vote.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
      isGlobal: true,
    }),
    DbModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'public'), // 指向静态文件根目录
    }),
    RedisModule,
    AuthModule,
    UsersModule,
    CandidatesModule,
    ElectionModule,
    VoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
