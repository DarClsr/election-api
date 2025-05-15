import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterDto {
  @IsNotEmpty({ message: "邮箱不能为空" })
  @IsEmail(
    {},
    {
      message: "邮箱格式错误",
    }
  )
  email: string;

  @IsNotEmpty({ message: "密码不能为空" })
  password: string;

  @IsNotEmpty()
  code: string;
}
