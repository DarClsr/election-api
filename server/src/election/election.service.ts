import { InjectModel } from "@m8a/nestjs-typegoose";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Patch,
} from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { Election } from "src/db/models/election.model";
import { CreateElectionDto } from "./dto/create-election.dto";
import { UpdateElectionDto } from "./dto/update-election.dto";
import { title } from "process";
import { start } from "repl";
import * as dayjs from "dayjs";
import { generateRandomStr } from "src/utils";

@Injectable()
export class ElectionService {
  constructor(
    @InjectModel(Election)
    private readonly electionModel: ReturnModelType<typeof Election>
  ) {}

  create(data: CreateElectionDto, user) {
    const [startTime, endTime] = data.times;
    if (new Date(startTime).getTime() > new Date(endTime).getTime()) {
      throw new BadRequestException("开始时间不能大于结束时间");
    }

    if (new Date(endTime) <= new Date()) {
      throw new BadRequestException("结束时间不能小于当前时间");
    }
    return this.electionModel.create({
      startTime,
      endTime,
      title: data.title,
      description: data.description,
      candidates: data.candidates,
      user: user._id,
      short_link: generateRandomStr(6),
    });
  }

  async findAll(query) {
    const skip = (query.page - 1) * query.limit;

    const list = await this.electionModel
      .find()
      .skip(skip)
      .limit(+query.limit);
    const total = await this.electionModel.countDocuments();
    return {
      list: list.map((v) => {
        return {
          ...v.toJSON(),
          times: [
            dayjs(v.startTime).format("YYYY-MM-DD"),
            dayjs(v.endTime).format("YYYY-MM-DD"),
          ],
        };
      }),
      total,
    };
  }

  findById(id: string) {
    return this.electionModel.findById(id);
  }

  async findOne(code: string) {
    return this.electionModel.findOne({ short_link:code }).populate("candidates");
  }

  async update(id: string, data: UpdateElectionDto) {
    const [startTime, endTime] = data.times;
    const updateElection = await this.electionModel.findByIdAndUpdate(
      id,
      {
        startTime: dayjs(startTime).toDate(),
        endTime: dayjs(endTime).toDate(),
        candidates: data.candidates,
        title: data.title,
        description: data.description,
      },
      { new: true }
    );
    if (!updateElection) {
      throw new NotFoundException("候选人不存在");
    }
    return updateElection;
  }

  async delete(id: string) {
    const result = await this.electionModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException("选举不存在");
    }
  }

  async active(id: string, active: number) {
    const election = await this.electionModel.findById(id);
    if (!election) {
      throw new NotFoundException("选举活动不存在");
    }
    if (election.startTime > new Date()) {
      throw new BadRequestException("选举活动未开始");
    }
    if (election.endTime < new Date()) {
      throw new BadRequestException("选举活动已结束");
    }

    await this.electionModel.findByIdAndUpdate(id, {
      $set: {
        isActive: active,
      },
    });
    return election.save();
  }
}
