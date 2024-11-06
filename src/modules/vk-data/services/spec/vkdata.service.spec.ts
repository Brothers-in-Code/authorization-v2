import { Test, TestingModule } from '@nestjs/testing';
import { VkDataService } from '../vkdata.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/db/services/user.service';
import { PostService } from 'src/db/services/post.service';
import { GroupService } from 'src/db/services/group.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/db/entities/user.entity'; // ваш репозиторий

describe('VkDataService', () => {
  let service: VkDataService;
  let userServiceMock: Partial<UserService>;
  let postServiceMock: Partial<PostService>;
  let groupServiceMock: Partial<GroupService>;
  let userRepositoryMock: Partial<User>;

  beforeEach(async () => {
    // Создаем моки для всех зависимостей
    userServiceMock = {
      findOne: jest.fn().mockResolvedValue({ access_token: 'mockAccessToken' }),
    };
    postServiceMock = {
      createNewPost: jest.fn(),
      createOrUpdatePostList: jest.fn(),
    };
    groupServiceMock = {
      createNewGroup: jest.fn(),
      createGroupList: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        VkDataService,
        ConfigService,
        { provide: UserService, useValue: userServiceMock },
        { provide: PostService, useValue: postServiceMock },
        { provide: GroupService, useValue: groupServiceMock },
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        }, // Мокаем UserRepository
      ],
    }).compile();

    service = module.get<VkDataService>(VkDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
