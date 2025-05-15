import { modelOptions, prop } from "@typegoose/typegoose";
import { genSaltSync, hashSync } from "bcryptjs";
import { get, trim } from "lodash";

export enum Role {
  admin = "admin",
  user = "user",
}

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class User {
  @prop({ required: true })
  email: string;
  @prop({
    required: true,
    select: false,
    get: (val) => val,
    set: (val) => {
      const saltRounds = 10;
      const salt = genSaltSync(saltRounds);
      return hashSync(trim(val), salt);
    },
  })
  password: string;
  @prop({ default: "user", enum: Role })
  role: string;
}
