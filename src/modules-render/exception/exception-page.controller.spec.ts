import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionPageController } from './exception-page.controller';

describe('500Controller', () => {
  let controller: ExceptionPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExceptionPageController],
    }).compile();

    controller = module.get<ExceptionPageController>(ExceptionPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
