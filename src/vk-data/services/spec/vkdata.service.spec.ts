import { Test, TestingModule } from '@nestjs/testing';
import { VkDataService } from '../vkdata.service';

describe('VkDataService', () => {
  let service: VkDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VkDataService],
    }).compile();

    service = module.get<VkDataService>(VkDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
