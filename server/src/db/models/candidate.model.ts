

import { prop } from '@typegoose/typegoose';

export class Candidate {
  @prop({ required: true })
  name: string;

  @prop()
  description?: string;

  @prop({ type: Date, default: Date.now })
  createdAt: Date;

  @prop({ type: Date, default: Date.now })
  updatedAt: Date;
}
