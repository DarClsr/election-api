import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import * as nodemailer from "nodemailer";
import { InjectModel } from "@m8a/nestjs-typegoose";
import { User } from "src/db/models/user.model";
import { ReturnModelType } from "@typegoose/typegoose";
import { RedisService } from "src/redis/redis.service";
import { MailService } from "src/mail/mail.service";
import { VERIFICATION_CODE_EXPIRE_MINUTES } from "src/utils/constants";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private model: ReturnModelType<typeof User>,
    private redisService: RedisService,
    private mailService: MailService,
    private readonly jwtService: JwtService
  ) {
    this.initAdmin()
  }

  async initAdmin() {
    await this.model.findOneAndUpdate(
      {
        email: "admin@admin.com",
      },
      {
        $set: {
          password: "admin",
          email: "admin@admin.com",
          role: "admin",
        },
      },
      {
        upsert: true,
      }
    );
    console.log("默认管理员账号已创建",{
      email: "admin@admin.com",
      password: "admin",
    });
  }

  async register(email: string, code: string,password?: string) {
    const sendCode = await this.redisService.get(`verify:${email}`);
    if (sendCode !== code) {
      throw new BadRequestException("验证码不正确");
    }

    const existingUser = await this.model.findOne({ email });
    if (existingUser) {
      throw new BadRequestException("邮箱已存在");
    }

    // 将用户保存到数据库
    const saveUser = await this.model.create({
      email,
      password,
    });
    // 示例返回用户对象和 JWT
    const payload = { email: saveUser.email };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        email: saveUser.email,
        role: saveUser.role,
      },
      token,
    };
  }

  async sendVerificationCode(email: string) {
    const sendCode = await this.redisService.get(`verify:${email}`);
    if (sendCode) {
      throw new HttpException("请勿重复发送验证码", 400);
    }
    const existingUser = await this.model.findOne({ email });
    if (existingUser) {
      throw new BadRequestException("邮箱已存在");
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    try {
      await this.mailService.sendVerificationCode(email, code);
      //存储缓存
      await this.redisService.set(
        `verify:${email}`,
        code,
        VERIFICATION_CODE_EXPIRE_MINUTES
      );
    } catch (e) {
      throw new BadRequestException("发送验证码失败");
    }
  }

  async login(email: string, password: string) {
    const user = await this.model.findOne({ email }).select("+password");
    if (!user) {
      throw new BadRequestException("用户不存在");
    }

    const compare = await bcrypt.compareSync(password, user.password);
    if (!compare) {
      throw new BadRequestException("密码错误");
    }
    const payload = { email: user.email };
    const token = this.jwtService.sign(payload);
    console.log({
      token
    })

    return {
      token: token,
      user: {
        email: user.email,
        role: user.role,
      },
    };
  }
}
