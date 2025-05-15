import { prop, Ref } from '@typegoose/typegoose';
import { User } from './user.model';
import { Election } from './election.model';
import { Candidate } from './candidate.model';

export class Vote {
  @prop({ ref: () => User, required: true })
  user: Ref<User>;

  @prop({ ref: () => Election, required: true })
  election: Ref<Election>;

  @prop({ ref: () => Candidate, required: true })
  candidates: Ref<Candidate>[]; 
}
