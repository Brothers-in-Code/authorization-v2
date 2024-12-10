import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { UserService } from 'src/db/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/db/entities/user.entity';
import { DatabaseServiceError } from 'src/errors/service-errors';
import { errors } from 'browser-sync/dist/config';

describe('AuthService Unit Tests', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
            updateToken: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('calcExpiresDate', () => {
    it('should return expires date', async () => {
      const expire_in = 3600;
      const date = new Date();
      date.setSeconds(date.getSeconds() + expire_in);
      const result = authService.calcExpiresDate(expire_in);
      const dateResult = new Date(result).getTime();
      expect(dateResult).toBeLessThanOrEqual(date.getTime());
    });
  });

  describe('saveUser', () => {
    describe('successfully', () => {
      it('should update user', async () => {
        const mockParams = {
          user_vkid: 100,
          access_token: 'test_access_token',
          refresh_token: 'test_refresh_token',
          device_id: 'test_device_id',
          expires_date: new Date(),
        };

        jest
          .spyOn(userService, 'findOne')
          .mockResolvedValueOnce(mockParams as User);

        const spyUpdateToken = jest
          .spyOn(userService, 'updateToken')
          .mockResolvedValue(mockParams as User);

        const response = await authService.saveUser(
          mockParams.user_vkid,
          mockParams.access_token,
          mockParams.refresh_token,
          mockParams.device_id,
          mockParams.expires_date,
        );
        expect(userService.findOne).toHaveBeenCalledWith(mockParams.user_vkid);
        expect(spyUpdateToken).toHaveBeenCalledWith(mockParams);
        expect(response).toEqual(mockParams);
      });

      it('should save user', async () => {
        const mockParams = {
          user_vkid: 100,
          access_token: 'test_access_token',
          refresh_token: 'test_refresh_token',
          device_id: 'test_device_id',
          expires_date: new Date(),
        };

        jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);
        jest
          .spyOn(userService, 'createUser')
          .mockResolvedValue(mockParams as User);

        const response = await authService.saveUser(
          mockParams.user_vkid,
          mockParams.access_token,
          mockParams.refresh_token,
          mockParams.device_id,
          mockParams.expires_date,
        );

        expect(userService.findOne).toHaveBeenCalledWith(mockParams.user_vkid);
        expect(userService.createUser).toHaveBeenCalledWith(mockParams);
        expect(response).toEqual(mockParams);
      });
    });

    describe('failurefully', () => {
      it('should throw exception can`t refresh token', () => {
        const mockParams = {
          user_vkid: 100,
          access_token: 'test_access_token',
          refresh_token: 'test_refresh_token',
          device_id: 'test_device_id',
          expires_date: new Date(),
        };

        jest
          .spyOn(userService, 'findOne')
          .mockResolvedValueOnce(mockParams as User);

        jest.spyOn(userService, 'updateToken').mockResolvedValue(null);

        const response = authService.saveUser(
          mockParams.user_vkid,
          mockParams.access_token,
          mockParams.refresh_token,
          mockParams.device_id,
          mockParams.expires_date,
        );

        expect(response).rejects.toThrow(
          new DatabaseServiceError(
            `func: saveUser. Не удалось обновить токен пользователя ${mockParams.user_vkid}`,
          ),
        );
      });

      it('should throw exception can`t create user', () => {
        const mockParams = {
          user_vkid: 100,
          access_token: 'test_access_token',
          refresh_token: 'test_refresh_token',
          device_id: 'test_device_id',
          expires_date: new Date(),
        };

        jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);

        jest.spyOn(userService, 'createUser').mockResolvedValue(null);

        const response = authService.saveUser(
          mockParams.user_vkid,
          mockParams.access_token,
          mockParams.refresh_token,
          mockParams.device_id,
          mockParams.expires_date,
        );

        expect(response).rejects.toThrow(
          new DatabaseServiceError(
            `func: saveUser. Не удалось создать пользователя ${mockParams.user_vkid}`,
          ),
        );
      });
    });
  });
});
