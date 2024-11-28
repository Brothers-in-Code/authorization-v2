import { Test, TestingModule } from '@nestjs/testing';
import { ScanApiService } from '../scan-api.service';

describe('ScanApiService', () => {
  let service: ScanApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScanApiService],
    }).compile();

    service = module.get<ScanApiService>(ScanApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
