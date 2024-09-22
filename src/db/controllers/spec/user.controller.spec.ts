import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../../services/user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService, // Замокированная версия UserService
          useValue: {
            // Моки методов, если нужно
            findAll: jest.fn(),
            findOne: jest.fn(),
            deleteUser: jest.fn(),
            createUser: jest.fn(),
            updateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
