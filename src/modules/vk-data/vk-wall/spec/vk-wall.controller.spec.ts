import { Test, TestingModule } from '@nestjs/testing';
import { VkWallDataController } from '../vk-wall.controller';

describe('VkWallDataController', () => {
  let controller: VkWallDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VkWallDataController],
    }).compile();

    controller = module.get<VkWallDataController>(VkWallDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
