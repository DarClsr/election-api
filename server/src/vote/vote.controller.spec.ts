import { Test, TestingModule } from '@nestjs/testing';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';

describe('VoteController', () => {
  let controller: VoteController;
  let voteService: VoteService;
  let module: TestingModule;

  const mockVoteService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [VoteController],
      providers: [
        {
          provide: VoteService,
          useValue: mockVoteService,
        },
      ],
    }).compile();

    controller = module.get<VoteController>(VoteController);
    voteService = module.get<VoteService>(VoteService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('vote', () => {
    it('should call voteService.create with correct parameters', async () => {
      const userId = 'user123';
      const dto: CreateVoteDto = {
        electionId: 'election456',
        candidateIds: ['candidate789', 'candidate101'],
      };

      const req = { user: { _id: userId } };
      const result = { success: true };

      mockVoteService.create.mockResolvedValue(result);

      const response = await controller.vote(dto, req);

      expect(voteService.create).toHaveBeenCalledWith(userId, dto);
      expect(response).toEqual(result);
    });
  });
});
