import { Test, TestingModule } from '@nestjs/testing';
import { ScanApiController } from '../scan-api.controller';

describe('ScanApiController', () => {
  let controller: ScanApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScanApiController],
    }).compile();

    controller = module.get<ScanApiController>(ScanApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
