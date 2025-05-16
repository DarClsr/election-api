import { Test, TestingModule } from '@nestjs/testing';
import { VoteService } from './vote.service';
import { getModelToken } from '@m8a/nestjs-typegoose';
import { Vote } from 'src/db/models/vote.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { ElectionService } from '../election/election.service';

describe('VoteService', () => {
  let service: VoteService;
  let mockVoteModel: any;
  let mockElectionService: any;
  let module: TestingModule;

  beforeEach(async () => {
    mockVoteModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn(),
      countDocuments: jest.fn(),
    };

    mockElectionService = {
      findById: jest.fn(),
    };

    module = await Test.createTestingModule({
      providers: [
        VoteService,
        {
          provide: getModelToken(Vote.name),
          useValue: mockVoteModel,
        },
        {
          provide: ElectionService,
          useValue: mockElectionService,
        },
      ],
    }).compile();

    service = module.get<VoteService>(VoteService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a vote successfully', async () => {
      const userId = 'user123';
      const voteData: CreateVoteDto = {
        electionId: 'election123',
        candidateIds: ['candidate1', 'candidate2'],
      };

      const mockElection = {
        _id: voteData.electionId,
        isActive: 1,
        startTime: new Date(Date.now() - 86400000), // 昨天
        endTime: new Date(Date.now() + 86400000), // 明天
      };

      mockElectionService.findById.mockResolvedValue(mockElection);
      mockVoteModel.findOne.mockResolvedValue(null);
      mockVoteModel.create.mockResolvedValue({
        election: voteData.electionId,
        user: userId,
        candidates: voteData.candidateIds,
      });

      const result = await service.create(userId, voteData);

      expect(result).toHaveProperty('election', voteData.electionId);
      expect(result).toHaveProperty('user', userId);
      expect(result).toHaveProperty('candidates', voteData.candidateIds);
    });

    it('should throw error if election not found', async () => {
      const userId = 'user123';
      const voteData: CreateVoteDto = {
        electionId: 'nonexistent',
        candidateIds: ['candidate1'],
      };

      mockElectionService.findById.mockResolvedValue(null);

      await expect(service.create(userId, voteData)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockElectionService.findById).toHaveBeenCalledWith(
        voteData.electionId,
      );
    });

    it('should throw error if election is not active', async () => {
      const userId = 'user123';
      const voteData: CreateVoteDto = {
        electionId: 'election123',
        candidateIds: ['candidate1'],
      };

      const mockElection = {
        _id: voteData.electionId,
        isActive: 0,
        startTime: new Date(Date.now() - 86400000),
        endTime: new Date(Date.now() + 86400000),
      };

      mockElectionService.findById.mockResolvedValue(mockElection);

      await expect(service.create(userId, voteData)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockElectionService.findById).toHaveBeenCalledWith(
        voteData.electionId,
      );
    });

    it('should throw error if election has not started', async () => {
      const userId = 'user123';
      const voteData: CreateVoteDto = {
        electionId: 'election123',
        candidateIds: ['candidate1'],
      };

      const mockElection = {
        _id: voteData.electionId,
        isActive: 1,
        startTime: new Date(Date.now() + 86400000), // 明天开始
        endTime: new Date(Date.now() + 172800000), // 后天结束
      };

      mockElectionService.findById.mockResolvedValue(mockElection);

      await expect(service.create(userId, voteData)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockElectionService.findById).toHaveBeenCalledWith(
        voteData.electionId,
      );
    });

    it('should throw error if election has ended', async () => {
      const userId = 'user123';
      const voteData: CreateVoteDto = {
        electionId: 'election123',
        candidateIds: ['candidate1'],
      };

      const mockElection = {
        _id: voteData.electionId,
        isActive: 1,
        startTime: new Date(Date.now() - 172800000), // 前天开始
        endTime: new Date(Date.now() - 86400000), // 昨天结束
      };

      mockElectionService.findById.mockResolvedValue(mockElection);

      await expect(service.create(userId, voteData)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockElectionService.findById).toHaveBeenCalledWith(
        voteData.electionId,
      );
    });

    it('should throw error if user already voted', async () => {
      const userId = 'user123';
      const voteData: CreateVoteDto = {
        electionId: 'election123',
        candidateIds: ['candidate1'],
      };

      const mockElection = {
        _id: voteData.electionId,
        isActive: 1,
        startTime: new Date(Date.now() - 86400000),
        endTime: new Date(Date.now() + 86400000),
      };

      mockElectionService.findById.mockResolvedValue(mockElection);
      mockVoteModel.findOne.mockResolvedValue({ _id: 'vote123' });

      await expect(service.create(userId, voteData)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockVoteModel.findOne).toHaveBeenCalledWith({
        election: voteData.electionId,
        user: userId,
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated votes list', async () => {
      const query = { page: 1, limit: 10 };
      const mockVotes = [
        {
          _id: 'vote1',
          election: 'election1',
          user: 'user1',
          candidates: ['candidate1', 'candidate2'],
        },
      ];
      const mockTotal = 1;

      mockVoteModel.limit.mockResolvedValue(mockVotes);
      mockVoteModel.countDocuments.mockResolvedValue(mockTotal);

      const result = await service.findAll(query);

      expect(mockVoteModel.find).toHaveBeenCalled();
      expect(mockVoteModel.skip).toHaveBeenCalledWith(0);
      expect(mockVoteModel.limit).toHaveBeenCalledWith(10);
      expect(mockVoteModel.countDocuments).toHaveBeenCalled();
      expect(result).toEqual({
        list: mockVotes,
        total: mockTotal,
      });
    });

    it('should handle empty page and limit', async () => {
      const query = {};
      const mockVotes = [];
      const mockTotal = 0;

      mockVoteModel.limit.mockResolvedValue(mockVotes);
      mockVoteModel.countDocuments.mockResolvedValue(mockTotal);

      const result = await service.findAll(query);

      expect(mockVoteModel.find).toHaveBeenCalled();
      expect(mockVoteModel.skip).toHaveBeenCalledWith(0);
      expect(mockVoteModel.limit).toHaveBeenCalledWith(10);
      expect(mockVoteModel.countDocuments).toHaveBeenCalled();
      expect(result).toEqual({
        list: mockVotes,
        total: mockTotal,
      });
    });
  });
});
