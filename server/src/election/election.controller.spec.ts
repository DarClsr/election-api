import { Test, TestingModule } from '@nestjs/testing';
import { ElectionController } from './election.controller';
import { ElectionService } from './election.service';

describe('ElectionController', () => {
  let controller: ElectionController;
  let service: ElectionService;

  const mockElectionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    active: jest.fn(),
    getResults: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElectionController],
      providers: [
        {
          provide: ElectionService,
          useValue: mockElectionService,
        },
      ],
    }).compile();

    controller = module.get<ElectionController>(ElectionController);
    service = module.get<ElectionService>(ElectionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an election', async () => {
      const createDto = {
        title: 'Test Election',
        description: 'Test Description',
        times: ['2024-01-01', '2024-01-02'],
        candidates: ['candidate1', 'candidate2'],
      };
      const user = { _id: 'user123' };

      const expectedResponse = {
        ...createDto,
        _id: 'election123',
        user: user._id,
      };

      mockElectionService.create.mockResolvedValue(expectedResponse);

      const result = await controller.create(createDto, user);

      expect(service.create).toHaveBeenCalledWith(createDto, user);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findAll', () => {
    it('should return all elections', async () => {
      const query = { page: 1, limit: 10 };
      const expectedResponse = {
        list: [
          { _id: '1', title: 'Election 1' },
          { _id: '2', title: 'Election 2' },
        ],
        total: 2,
      };

      mockElectionService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a single election', async () => {
      const code = 'abc123';
      const expectedResponse = {
        _id: 'election123',
        title: 'Test Election',
        short_link: code,
      };

      mockElectionService.findOne.mockResolvedValue(expectedResponse);

      const result = await controller.findOne(code);

      expect(service.findOne).toHaveBeenCalledWith(code);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('update', () => {
    it('should update an election', async () => {
      const id = 'election123';
      const updateDto = {
        title: 'Updated Election',
        description: 'Updated Description',
        times: ['2024-01-01', '2024-01-02'],
        candidates: ['candidate1', 'candidate2'],
      };

      const expectedResponse = {
        _id: id,
        ...updateDto,
      };

      mockElectionService.update.mockResolvedValue(expectedResponse);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('remove', () => {
    it('should remove an election', async () => {
      const id = 'election123';

      await controller.remove(id);

      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('active', () => {
    it('should activate/deactivate an election', async () => {
      const id = 'election123';
      const activeDto = { status: 1 };
      const expectedResponse = {
        _id: id,
        isActive: 1,
      };

      mockElectionService.active.mockResolvedValue(expectedResponse);

      const result = await controller.active(id, activeDto);

      expect(service.active).toHaveBeenCalledWith(id, activeDto.status);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getResults', () => {
    it('should return election results', async () => {
      const electionId = 'election123';
      const expectedResponse = {
        list: [
          { _id: 'candidate1', name: 'Candidate 1', votes: 10, percentage: 66.67 },
          { _id: 'candidate2', name: 'Candidate 2', votes: 5, percentage: 33.33 },
        ],
        total: 15,
      };

      mockElectionService.getResults.mockResolvedValue(expectedResponse);

      const result = await controller.getResults(electionId);

      expect(service.getResults).toHaveBeenCalledWith(electionId);
      expect(result).toEqual(expectedResponse);
    });
  });
});
