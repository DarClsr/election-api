import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let module: TestingModule;

  const mockUsersService = {
    findAll: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  const mockRolesGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    const mockUsers = [
      { id: 1, username: 'user1' },
      { id: 2, username: 'user2' },
    ];

    const mockPaginatedResponse = {
      list: mockUsers,
      total: mockUsers.length,
    };

    it('should return paginated users list', async () => {
      const query = { page: 1, limit: 10 };
      mockUsersService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should pass query parameters correctly', async () => {
      const query = { page: 2, limit: 5 };
      await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
    });

    it('should handle empty query parameters', async () => {
      const query = {};
      await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });
});
