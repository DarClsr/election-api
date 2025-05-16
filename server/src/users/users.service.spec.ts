import { getModelToken } from '@m8a/nestjs-typegoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Role, User } from 'src/db/models/user.model';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel: any;
  let module: TestingModule;

  const mockUsers = [
    {
      _id: '1',
      username: 'user1',
      email: 'user1@example.com',
      role: Role.user,
    },
    {
      _id: '2',
      username: 'user2',
      email: 'user2@example.com',
      role: Role.user,
    },
  ];

  beforeEach(async () => {
    mockUserModel = {
      find: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockUsers),
      countDocuments: jest.fn().mockResolvedValue(mockUsers.length),
    };

    module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated users list', async () => {
      const query = { page: 1, limit: 10 };
      const result = await service.findAll(query);

      expect(mockUserModel.find).toHaveBeenCalledWith({ role: Role.user });
      expect(mockUserModel.skip).toHaveBeenCalledWith(0);
      expect(mockUserModel.limit).toHaveBeenCalledWith(10);
      expect(result).toEqual({
        list: mockUsers,
        total: mockUsers.length,
      });
    });

    it('should handle pagination correctly', async () => {
      const query = { page: 2, limit: 5 };
      await service.findAll(query);

      expect(mockUserModel.skip).toHaveBeenCalledWith(5);
      expect(mockUserModel.limit).toHaveBeenCalledWith(5);
    });

    it('should handle empty results', async () => {
      mockUserModel.limit.mockResolvedValueOnce([]);
      mockUserModel.countDocuments.mockResolvedValueOnce(0);

      const query = { page: 1, limit: 10 };
      const result = await service.findAll(query);

      expect(result).toEqual({
        list: [],
        total: 0,
      });
    });
  });
});
