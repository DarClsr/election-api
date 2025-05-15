import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: "邮箱不能为空" })
  @IsEmail(
    {},
    {
      message: "邮箱格式错误",
    }
  )
  email: string;


  @IsNotEmpty()
  password: string;
}
