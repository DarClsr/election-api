import { IsEmail, IsNotEmpty } from "class-validator";

export class VerifyEmailDto {
  @IsNotEmpty({ message: "邮箱不能为空" })
  @IsEmail(
    {},
    {
      message: "邮箱格式错误",
    }
  )
  email: string;
}
