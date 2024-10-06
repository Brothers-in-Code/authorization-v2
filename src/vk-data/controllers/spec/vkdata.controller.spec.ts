import { Test, TestingModule } from '@nestjs/testing';
import { VkDataController } from '../vkdata.controller';
import { VkDataService } from 'src/vk-data/services/vkdata.service';
import { UserService } from 'src/db/services/user.service';
import { UserGroupService } from 'src/db/services/user-group.service';

describe('VkDataController', () => {
  let controller: VkDataController;
  let vkDataServiceMock: Partial<VkDataService>;
  let userServiceMock: Partial<UserService>;
  let userGroupServiceMock: Partial<UserGroupService>;

  beforeEach(async () => {
    // Мок для VkDataService
    vkDataServiceMock = {
      getUserGroupListFromVK: jest.fn(),
      saveGroupList: jest.fn(),
      getWallPrivetGroup: jest.fn(),
    };

    // Мок для UserService
    userServiceMock = {
      findOne: jest.fn(),
    };

    // Мок для UserGroupService
    userGroupServiceMock = {
      createUserGroupList: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VkDataController],
      providers: [
        { provide: VkDataService, useValue: vkDataServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: UserGroupService, useValue: userGroupServiceMock },
      ],
    }).compile();

    controller = module.get<VkDataController>(VkDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
