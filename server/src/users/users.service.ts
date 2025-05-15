import { InjectModel } from "@m8a/nestjs-typegoose";
import { Injectable } from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { Election } from "src/db/models/election.model";
import { Role, User } from "src/db/models/user.model";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: ReturnModelType<typeof Election>
  ) {}
  async findAll(query) {
    const skip = (query.page - 1) * query.limit;

    const list = await this.userModel
      .find({
        role: Role.user,
      })
      .skip(skip)
      .limit(+query.limit);
    const total = await this.userModel.countDocuments({
      role: Role.user,
    });
    return {
      list: list,
      total,
    };
  }
}
