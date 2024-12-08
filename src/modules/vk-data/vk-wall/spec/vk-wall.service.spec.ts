import { Test, TestingModule } from '@nestjs/testing';
import { VkWallDataService } from '../vk-wall.service';

describe('VkWallDataService', () => {
  let service: VkWallDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VkWallDataService],
    }).compile();

    service = module.get<VkWallDataService>(VkWallDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
