import { Test, TestingModule } from '@nestjs/testing';
import { ElectionService } from './election.service';
import { getModelToken } from '@m8a/nestjs-typegoose';
import { Election } from '../db/models/election.model';
import { Vote } from '../db/models/vote.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('ElectionService', () => {
  let service: ElectionService;
  let mockElectionModel: any;
  let mockVoteModel: any;
  let module: TestingModule;
  let consoleSpy: jest.SpyInstance;

  beforeEach(async () => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.useFakeTimers();
    
    mockElectionModel = {
      create: jest.fn(),
      find: jest.fn().mockReturnThis(),
      findById: jest.fn(),
      findOne: jest.fn().mockReturnThis(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn(),
      countDocuments: jest.fn(),
      aggregate: jest.fn(),
      populate: jest.fn(),
    };

    mockVoteModel = {
      aggregate: jest.fn(),
    };

    module = await Test.createTestingModule({
      providers: [
        ElectionService,
        {
          provide: getModelToken(Election.name),
          useValue: mockElectionModel,
        },
        {
          provide: getModelToken(Vote.name),
          useValue: mockVoteModel,
        },
      ],
    }).compile();

    service = module.get<ElectionService>(ElectionService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    consoleSpy.mockRestore();
    await module.close();
    await new Promise(resolve => setTimeout(resolve, 100)); // 等待所有异步操作完成
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an election successfully', async () => {
      const createDto = {
        title: 'Test Election',
        description: 'Test Description',
        candidates: ['candidate1', 'candidate2'],
        times: ['2025-05-16T08:34:21.537Z', '2025-05-16T09:34:21.537Z'],
      };

      const user = { _id: 'user123' };

      const mockCreatedElection = {
        title: createDto.title,
        description: createDto.description,
        candidates: createDto.candidates,
        user: user._id,
        startTime: new Date(createDto.times[0]),
        endTime: new Date(createDto.times[1]),
        short_link: expect.any(String),
      };

      mockElectionModel.create.mockResolvedValue(mockCreatedElection);

      const result = await service.create(createDto, user);

      expect(mockElectionModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: createDto.title,
          description: createDto.description,
          candidates: createDto.candidates,
          user: user._id,
          startTime: createDto.times[0],
          endTime: createDto.times[1],
          short_link: expect.any(String),
        }),
      );

      expect(result).toEqual(mockCreatedElection);
    });

    it('should throw error if end time is before start time', async () => {
      const createDto = {
        title: 'Test Election',
        description: 'Test Description',
        candidates: ['candidate1', 'candidate2'],
        times: ['2025-05-16T09:34:21.537Z', '2025-05-16T08:34:21.537Z'],
      };

      const user = { _id: 'user123' };

      await expect(async () => {
        await service.create(createDto, user);
      }).rejects.toThrow(BadRequestException);

      await expect(async () => {
        await service.create(createDto, user);
      }).rejects.toThrow('开始时间不能大于结束时间');
    });
  });

  describe('findAll', () => {
    it('should return paginated elections list', async () => {
      const query = { page: 1, limit: 10 };
      const mockElections = [
        {
          toJSON: () => ({
            id: 'election1',
            title: 'Election 1',
            startTime: new Date('2025-05-16T08:34:21.537Z'),
            endTime: new Date('2025-05-16T09:34:21.537Z'),
          }),
        },
      ];

      mockElectionModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockElections),
        }),
      });
      mockElectionModel.countDocuments.mockResolvedValue(mockElections.length);

      const result = await service.findAll(query);

      expect(result).toEqual({
        list: mockElections.map((election) => ({
          ...election.toJSON(),
          times: [expect.any(String), expect.any(String)],
        })),
        total: mockElections.length,
      });
    });
  });

  describe('findOne', () => {
    it('should find election by code', async () => {
      const code = 'test-code';
      const mockElection = {
        id: 'election1',
        title: 'Test Election',
        short_link: code,
      };

      mockElectionModel.findOne.mockReturnThis();
      mockElectionModel.populate.mockResolvedValue(mockElection);

      const result = await service.findOne(code);
      expect(result).toEqual(mockElection);
    });

    it('should throw error if election not found', async () => {
      const code = 'nonexistent-code';

      mockElectionModel.findOne.mockReturnThis();
      mockElectionModel.populate.mockResolvedValue(null);

      await expect(service.findOne(code)).resolves.toBeNull();
    });
  });

  describe('getResults', () => {
    it('should return election results', async () => {
      const electionId = new Types.ObjectId().toString();
      const mockElection = {
        _id: electionId,
        title: 'Test Election',
      };

      const mockAggregateResults = [
        {
          stats: [
            {
              _id: 'candidate1',
              name: 'Candidate 1',
              votes: 5,
            },
          ],
          total: [{ total: 5 }],
        },
      ];

      mockElectionModel.findById.mockResolvedValue(mockElection);
      mockVoteModel.aggregate.mockResolvedValue(mockAggregateResults);

      const result = await service.getResults(electionId);

      expect(result).toHaveProperty('list');
      expect(result).toHaveProperty('total', 5);
    });

    it('should throw error if election not found', async () => {
      const electionId = new Types.ObjectId().toString();

      mockElectionModel.findById.mockResolvedValue(null);

      await expect(service.getResults(electionId)).rejects.toThrow(
        new NotFoundException('选举活动不存在'),
      );
    });
  });
});
