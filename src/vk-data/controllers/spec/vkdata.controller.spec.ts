import { Test, TestingModule } from '@nestjs/testing';
import { VkDataController } from '../vkdata.controller';
import { VkDataService } from 'src/vk-data/services/vkdata.service';

describe('VkDataController', () => {
  let controller: VkDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VkDataController],
      providers: [
        {
          provide: VkDataService,
          useValue: {
            getUserGroupListFromVK: jest.fn(),
            saveGroupList: jest.fn(),
            getWallPrivetGroup: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VkDataController>(VkDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
