import { Test, TestingModule } from '@nestjs/testing';
import { VkDataController } from './vk-data.controller';

describe('VkDataController', () => {
  let controller: VkDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VkDataController],
    }).compile();

    controller = module.get<VkDataController>(VkDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
