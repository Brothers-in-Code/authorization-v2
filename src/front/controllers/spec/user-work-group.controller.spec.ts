import { Test, TestingModule } from '@nestjs/testing';
import { UserWorkGroupController } from '../user-work-group.controller';

describe('GroupControllerController', () => {
  let controller: UserWorkGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserWorkGroupController],
    }).compile();

    controller = module.get<UserWorkGroupController>(UserWorkGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
