import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { Model, Types } from "mongoose";
import { CreateVoteDto } from "./dto/create-vote.dto";
import { InjectModel } from "@m8a/nestjs-typegoose";
import { Vote } from "src/db/models/vote.model";
import { ReturnModelType } from "@typegoose/typegoose";
import { ElectionService } from "src/election/election.service";

@Injectable()
export class VoteService {
  constructor(
    @InjectModel(Vote) private voteModel: ReturnModelType<typeof Vote>,
    private electionService: ElectionService
  ) {}

  async create(userId: string, dto: CreateVoteDto) {
    const { electionId, candidateIds } = dto;
   
    const election = await this.electionService.findById(electionId);

    
    if (!election) {
      throw new NotFoundException("选举不存在");
    }

    if (!election.isActive) {
      throw new BadRequestException("选举活动未开始");
    }

    if (election.endTime < new Date()) {
      throw new BadRequestException("选举活动已结束");
    }

    if (election.startTime > new Date()) {
      throw new BadRequestException("选举活动未开始");
    }

    const maxVotes = Math.max(2, Math.floor(election.candidates.length * 0.2));

    if (candidateIds.length > maxVotes) {
      throw new BadRequestException(`每个用户最多投票${maxVotes}个`);
    }

    if (candidateIds.length < 2) {
      throw new BadRequestException("至少选择两个候选人");
    }

    const existingVote = await this.voteModel.findOne({
      user: userId,
      election: electionId,
    });

    if (existingVote) {
      throw new BadRequestException("您已经投过票了");
    }

    console.log({
      user: userId,
      election: electionId,
      candidates: candidateIds,
    });

    const vote = await this.voteModel.create({
      user: userId,
      election: electionId,
      candidates: candidateIds,
    });

    return vote;
  }

  async getVoteCount(electionId: string) {
    const result = await this.voteModel.aggregate([
      { $match: { election: new Types.ObjectId(electionId) } },
      {
        $unwind:  "$candidates",
      },
      {
        $group: {
          _id: "$candidate",
          votes: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "candidates",
          localField: "_id",
          foreignField: "_id",
          as: "candidate",
        },
      },
      {
        $unwind: "$candidate",
      },
      {
        $project: {
          _id: 0,
          candidateId: "$_id",
          name: "$candidate.name",
          votes: 1,
        },
      },
    ]);

    return result;
  }
}
