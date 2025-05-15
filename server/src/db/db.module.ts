import { Global, Module } from '@nestjs/common';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { setGlobalOptions } from '@typegoose/typegoose';
import { User } from './models/user.model';
import { Candidate } from './models/candidate.model';
import { Vote } from './models/vote.model';
import { Election } from './models/election.model';

@Global()
@Module({
  imports: [
    TypegooseModule.forRootAsync({
      useFactory: () => {
        return {
          uri: process.env.MONGO_URI
        };
      },
    }),
    TypegooseModule.forFeature([
      User,
      Candidate,
      Vote,
      Election
    ]),
  ],
  exports: [TypegooseModule],
})
export class DbModule {}
