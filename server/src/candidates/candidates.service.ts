import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Candidate } from 'src/db/models/candidate.model';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(Candidate)
    private readonly candidateModel: ReturnModelType<typeof Candidate>,
  ) {}

  async create(createCandidateDto: CreateCandidateDto): Promise<Candidate> {
    return await this.candidateModel.create(createCandidateDto);
  }

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const list = await this.candidateModel.find().skip(skip).limit(limit);
    const total = await this.candidateModel.countDocuments();
    return {
      list,
      total,
    };
  }
  async getOptions() {
    const data = await this.candidateModel.find().select('name');

    return data.map((v) => {
      return {
        label: v.name,
        value: v._id,
      };
    });
  }

  async findOne(id: string): Promise<Candidate> {
    const candidate = await this.candidateModel.findById(id);
    if (!candidate) {
      throw new NotFoundException('候选人不存在');
    }
    return candidate;
  }

  async update(
    id: string,
    updateCandidateDto: UpdateCandidateDto,
  ): Promise<Candidate> {
    const updatedCandidate = await this.candidateModel.findByIdAndUpdate(
      id,
      updateCandidateDto,
      { new: true },
    );

    if (!updatedCandidate) {
      throw new NotFoundException('候选人不存在');
    }

    return updatedCandidate;
  }

  async remove(id: string): Promise<void> {
    const result = await this.candidateModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('候选人不存在');
    }
  }
}
