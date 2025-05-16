import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesService } from './candidates.service';
import { getModelToken } from '@m8a/nestjs-typegoose';
import { Candidate } from '../db/models/candidate.model';
import { NotFoundException } from '@nestjs/common';

describe('CandidatesService', () => {
  let service: CandidatesService;
  let mockCandidateModel: any;

  beforeEach(async () => {
    mockCandidateModel = {
      create: jest.fn(),
      find: jest.fn().mockReturnThis(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn(),
      countDocuments: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidatesService,
        {
          provide: getModelToken(Candidate.name),
          useValue: mockCandidateModel,
        },
      ],
    }).compile();

    service = module.get<CandidatesService>(CandidatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a candidate successfully', async () => {
      const createDto = {
        name: 'Test Candidate',
        description: 'Test Description',
      };

      const mockCandidate = {
        _id: 'candidate123',
        ...createDto,
        save: jest
          .fn()
          .mockResolvedValue({ _id: 'candidate123', ...createDto }),
      };

      mockCandidateModel.create.mockResolvedValue(mockCandidate);

      const result = await service.create(createDto);

      expect(result).toEqual(expect.objectContaining(createDto));
    });
  });

  describe('findAll', () => {
    it('should return paginated candidates list', async () => {
      const query = { page: 1, limit: 10 };
      const mockCandidates = [
        { _id: 'candidate1', name: 'Candidate 1' },
        { _id: 'candidate2', name: 'Candidate 2' },
      ];

      mockCandidateModel.find.mockReturnThis();
      mockCandidateModel.skip.mockReturnThis();
      mockCandidateModel.limit.mockResolvedValue(mockCandidates);
      mockCandidateModel.countDocuments.mockResolvedValue(
        mockCandidates.length,
      );

      const result = await service.findAll(query);

      expect(result.list).toEqual(mockCandidates);
      expect(result.total).toBe(mockCandidates.length);
      expect(mockCandidateModel.skip).toHaveBeenCalledWith(
        (query.page - 1) * query.limit,
      );
      expect(mockCandidateModel.limit).toHaveBeenCalledWith(query.limit);
    });
  });

  describe('findOne', () => {
    it('should find candidate by id', async () => {
      const id = 'candidate123';
      const mockCandidate = {
        _id: id,
        name: 'Test Candidate',
      };

      mockCandidateModel.findById.mockResolvedValue(mockCandidate);

      const result = await service.findOne(id);

      expect(mockCandidateModel.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockCandidate);
    });

    it('should throw error if candidate not found', async () => {
      const id = 'nonexistent';
      mockCandidateModel.findById.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update candidate successfully', async () => {
      const id = 'some-id';
      const updateDto = { name: 'Updated Name' };
      const updatedCandidate = { id, ...updateDto };

      mockCandidateModel.findByIdAndUpdate.mockResolvedValue(updatedCandidate);

      const result = await service.update(id, updateDto);
      expect(result).toEqual(updatedCandidate);
    });

    it('should throw error if candidate not found', async () => {
      const id = 'nonexistent-id';
      const updateDto = { name: 'Updated Name' };

      mockCandidateModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove candidate successfully', async () => {
      const id = 'some-id';
      const deletedCandidate = { id };

      mockCandidateModel.findByIdAndDelete.mockResolvedValue(deletedCandidate);

      await service.remove(id);
      expect(mockCandidateModel.findByIdAndDelete).toHaveBeenCalledWith(id);
    });

    it('should throw error if candidate not found', async () => {
      const id = 'nonexistent-id';

      mockCandidateModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
