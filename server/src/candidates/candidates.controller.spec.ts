import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';

describe('CandidatesController', () => {
  let controller: CandidatesController;
  let service: CandidatesService;
  let module: TestingModule;

  const mockCandidatesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [CandidatesController],
      providers: [
        {
          provide: CandidatesService,
          useValue: mockCandidatesService,
        },
      ],
    }).compile();

    controller = module.get<CandidatesController>(CandidatesController);
    service = module.get<CandidatesService>(CandidatesService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a candidate', async () => {
      const createDto = {
        name: 'Test Candidate',
        description: 'Test Description',
        avatar: 'test-avatar.jpg',
      };

      const mockCandidate = {
        _id: 'candidate123',
        ...createDto,
      };

      mockCandidatesService.create.mockResolvedValue(mockCandidate);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockCandidate);
    });
  });

  describe('findAll', () => {
    it('should return paginated candidates list', async () => {
      const query = { page: 1, limit: 10 };
      const mockResponse = {
        list: [
          { _id: '1', name: 'Candidate 1' },
          { _id: '2', name: 'Candidate 2' },
        ],
        total: 2,
      };

      mockCandidatesService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should return a candidate', async () => {
      const id = 'candidate123';
      const mockCandidate = {
        _id: id,
        name: 'Test Candidate',
      };

      mockCandidatesService.findOne.mockResolvedValue(mockCandidate);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockCandidate);
    });
  });

  describe('update', () => {
    it('should update a candidate', async () => {
      const id = 'candidate123';
      const updateDto = {
        name: 'Updated Candidate',
        description: 'Updated Description',
      };

      const mockUpdatedCandidate = {
        _id: id,
        ...updateDto,
      };

      mockCandidatesService.update.mockResolvedValue(mockUpdatedCandidate);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(mockUpdatedCandidate);
    });
  });

  describe('remove', () => {
    it('should remove a candidate', async () => {
      const id = 'candidate123';

      await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
