import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { CandidatesModule } from "./candidates/candidates.module";
import { ElectionModule } from "./election/election.module";
import { VoteService } from "./vote/vote.service";
import { VoteController } from "./vote/vote.controller";
import { TypegooseModule } from "@m8a/nestjs-typegoose";
import { User } from "./db/models/user.model";
import { JwtModule } from "@nestjs/jwt";
import { DbModule } from "./db/db.module";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"), // 指向静态文件根目录
      exclude: ["/api*"], // 防止与后端接口冲突
    }),
    RedisModule,
    AuthModule,
    UsersModule,
    CandidatesModule,
    ElectionModule,
  ],
  controllers: [AppController, VoteController],
  providers: [AppService, VoteService],
})
export class AppModule {}
