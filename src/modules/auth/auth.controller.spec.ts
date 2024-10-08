import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';

import { AuthService } from './services/auth.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/db/services/user.service';
import { HttpService } from '@nestjs/axios';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
