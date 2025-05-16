import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { ElectionService } from 'src/election/election.service';
import { ElectionModule } from 'src/election/election.module';

@Module({
  imports: [ElectionModule],
  providers: [VoteService, ElectionService],
  controllers: [VoteController],
  exports: [VoteService],
})
export class VoteModule {}
