import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { query } from "express";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "./user.decorator";
import { LoginDto } from "./dto/login.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("认证")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get("code")
  sendCode(@Query(new ValidationPipe()) query: VerifyEmailDto) {
    return this.authService.sendVerificationCode(query.email);
  }

  @ApiOperation({ summary: "注册" })
  @Post("register")
  register(@Body(new ValidationPipe()) dto: RegisterDto) {
    return this.authService.register(dto.email, dto.code, dto.password);
  }
  @ApiOperation({ summary: "登录" })
  @Post("login")
  async login(@Body(new ValidationPipe()) dto: LoginDto) {
    return await this.authService.login(dto.email, dto.password);
  }
  @ApiOperation({ summary: "获取用户信息" })
  @Get("profile")
  getUserInfo(@CurrentUser() user) {
    return user;
  }
}
