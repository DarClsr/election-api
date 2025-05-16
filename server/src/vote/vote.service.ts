import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { Vote } from 'src/db/models/vote.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { ElectionService } from '../election/election.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class VoteService {
  constructor(
    @InjectModel(Vote) private readonly voteModel: ReturnModelType<typeof Vote>,
    private readonly electionService: ElectionService,
  ) {}

  async create(userId: string, dto: CreateVoteDto) {
    const { electionId, candidateIds } = dto;

    const election = await this.electionService.findById(electionId);

    if (!election) {
      throw new NotFoundException('选举不存在');
    }

    if (!election.isActive) {
      throw new BadRequestException('选举未激活');
    }

    const now = new Date();
    if (now < election.startTime || now > election.endTime) {
      throw new BadRequestException('不在投票时间范围内');
    }

    const existingVote = await this.voteModel.findOne({
      election: electionId,
      user: userId,
    });

    if (existingVote) {
      throw new BadRequestException('您已经投过票了');
    }

    return await this.voteModel.create({
      election: electionId,
      user: userId,
      candidates: candidateIds,
    });
  }

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const list = await this.voteModel.find().skip(skip).limit(limit);

    const total = await this.voteModel.countDocuments();

    return {
      list,
      total,
    };
  }
}
