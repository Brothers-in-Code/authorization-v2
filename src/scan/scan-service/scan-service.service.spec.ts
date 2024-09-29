import { Test, TestingModule } from '@nestjs/testing';
import { ScanServiceService } from './scan-service.service';

describe('ScanServiceService', () => {
  let service: ScanServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScanServiceService],
    }).compile();

    service = module.get<ScanServiceService>(ScanServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
