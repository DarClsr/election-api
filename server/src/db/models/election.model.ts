// election.model.ts
import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Candidate } from "./candidate.model";
import { User } from "./user.model";

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class Election {
  @prop({ required: true })
  title: string;

  @prop()
  description?: string;

  @prop({ required: true })
  startTime: Date;

  @prop({ required: true })
  short_link: string;

  @prop({ required: true })
  endTime: Date;

  @prop({ default: 0 })
  isActive: number;

  @prop({ default: Date.now })
  createdAt: Date;

  @prop({ default: Date.now })
  updatedAt: Date;

  @prop({ ref: () => Candidate, required: true, default: [] })
  candidates: Ref<Candidate>[];

  @prop({ ref: () => User, required: true })
  user: Ref<User>;

  get candidate_count() {
    return (this.candidates && this.candidates.length) || 0;
  }
}
