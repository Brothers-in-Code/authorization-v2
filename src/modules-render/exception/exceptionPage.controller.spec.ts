import { Test, TestingModule } from '@nestjs/testing';
import { 500Controller } from './exception.controller';

describe('500Controller', () => {
  let controller: 500Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [500Controller],
    }).compile();

    controller = module.get<500Controller>(500Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
