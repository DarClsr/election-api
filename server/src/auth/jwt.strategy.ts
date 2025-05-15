import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@m8a/nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { User } from "src/db/models/user.model";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User) private userModel: ReturnModelType<typeof User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(req: Request, payload: any) {
    const user = await this.userModel.findOne({
      email: payload.email,
    });
    if (!user) {
      throw new UnauthorizedException("非法请求，请先登录");
    }
    return user;
  }
}
