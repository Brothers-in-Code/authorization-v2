import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { UserService } from 'src/db/services/user.service';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/db/entities/user.entity';

import { VKUserInfoType } from 'src/types/vk-user-info-type';
import { VKResponseTokenType } from 'src/types/vk-refresh-token-type';
import { UnauthorizedException } from '@nestjs/common';
import { DatabaseServiceError } from 'src/errors/service-errors';
import { VK_API_Error, VK_AUTH_Error } from 'src/errors/vk-errors';

import { getAppState, getVerifier } from 'src/utils/verifiers';
import SpyInstance = jest.SpyInstance;
import clearAllMocks = jest.clearAllMocks;
jest.mock('src/utils/verifiers');

const mockState = describe('AuthService Unit Tests', () => {
  let authService: AuthService;
  let userService: UserService;
  let httpService: HttpService;
  let jwtService: JwtService;
  let configService: ConfigService;

  let axiosRefPost: SpyInstance;

  const mockErrorResponse = {
    error: 'mock error',
    error_description: 'mock error description',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'vk') return { appId: 111111 };
              if (key === 'app') return { frontend: 'some url' };
            }),
          },
        },
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              post: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
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
    httpService = module.get<HttpService>(HttpService);
    jwtService = module.get<JwtService>(JwtService);
    axiosRefPost = jest.spyOn(httpService.axiosRef, 'post');
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

    describe('failure fully', () => {
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

  describe('getUserInfo', () => {
    const mockInfoParams = {
      access_token: 'test_access_token',
      client_id: 101,
      scope: 'email',
    };

    it('should get user info', async () => {
      const mockUserInfoResponse: VKUserInfoType = {
        user: {
          user_id: 'test_user_id',
          first_name: 'test_first_name',
          last_name: 'test_last_name',
          avatar: 'test_avatar',
          sex: 1,
          is_verified: false,
          birthday: 'test_birthday',
        },
      };
      axiosRefPost.mockResolvedValue({ data: mockUserInfoResponse });
      const response = await authService.getUserInfo(
        mockInfoParams.access_token,
      );
      expect(response).toEqual(mockUserInfoResponse);
    });

    it('should throw exception can`t get user info', async () => {
      axiosRefPost.mockResolvedValue({ data: mockErrorResponse });

      const response = authService.getUserInfo(mockInfoParams.access_token);
      await expect(response).rejects.toThrow(
        new VK_API_Error(
          `user_info не получен. ${mockErrorResponse.error_description}`,
        ),
      );
    });
  });

  describe('refreshAccessToken', () => {
    const mockState = 'mockState';
    const mockParams = {
      refresh_token: 'mock refresh_token',
      device_id: 'mock device_id',
    };

    const mockTokenResponse: VKResponseTokenType = {
      refresh_token: 'refresh_token',
      access_token: 'access_token',
      token_type: 'token_type',
      expires_in: 3600,
      user_id: 101,
      scope: 'scope',
      state: 'mockState',
    };

    beforeEach(() => {
      jest.clearAllMocks();
      (getAppState as jest.Mock).mockReturnValue(mockState);
    });

    describe('successfully', () => {
      it('should get refresh token', async () => {
        axiosRefPost.mockResolvedValue({ data: mockTokenResponse });

        const response = await authService.refreshAccessToken(
          mockParams.refresh_token,
          mockParams.device_id,
        );

        expect(response).toEqual({
          access_token: mockTokenResponse.access_token,
          refresh_token: mockTokenResponse.refresh_token,
          expires_in: mockTokenResponse.expires_in,
        });
      });
    });

    describe('failure fully', () => {
      it('should throw exception state не совпадает', async () => {
        mockTokenResponse.state = 'wrongState';
        axiosRefPost.mockResolvedValue({ data: mockTokenResponse });
        const response = authService.refreshAccessToken(
          mockParams.refresh_token,
          mockParams.device_id,
        );
        await expect(response).rejects.toThrow(
          new UnauthorizedException(
            `state не совпадает. local_state: ${mockState}, vk_state: ${mockTokenResponse.state}`,
          ),
        );
      });

      it('should throw exception access_token не получен', async () => {
        axiosRefPost.mockResolvedValue({ data: mockErrorResponse });

        const response = authService.refreshAccessToken(
          mockParams.refresh_token,
          mockParams.device_id,
        );

        await expect(response).rejects.toThrow(
          new VK_AUTH_Error(
            `access_token не получен. ${mockErrorResponse.error_description}`,
          ),
        );
      });
    });
  });

  describe('getAccessToken', () => {
    const mockParams = {
      code: 'mockCode',
      device_id: 'mockShouldGetExactlyThisString',
      code_verifier: 'mockCode_verifier',
    };

    const mockTokenResponse = {
      access_token: 'mockAccess_token',
      refresh_token: 'mockRefresh_token',
      expires_in: 'mockExpires_in',
      id_token: 'mockId_token',
      user_id: 'mockUser_id',
      device_id: 'mockShouldGetExactlyThisString',
    };

    describe('successfully', () => {
      it('should get access token', async () => {
        axiosRefPost.mockResolvedValue({ data: mockTokenResponse });
        const response = await authService.getAccessToken(
          mockParams.code,
          mockParams.device_id,
          mockParams.code_verifier,
        );

        expect(response).toEqual(mockTokenResponse);
      });
    });

    describe('failure fully', () => {
      it('should throw exception access_token не получен', async () => {
        axiosRefPost.mockResolvedValue({ data: mockErrorResponse });

        const response = authService.getAccessToken(
          mockParams.code,
          mockParams.device_id,
          mockParams.code_verifier,
        );

        await expect(response).rejects.toThrow(
          new UnauthorizedException(
            `access_token не получен. ${mockErrorResponse.error_description}`,
          ),
        );
      });
    });
  });

  describe('verifyState', () => {
    const mockState = 'mockRightState';
    it('should return true', () => {
      const mockCookieState = 'mockRightState';
      const response = authService.verifyState(mockState, mockCookieState);
      expect(response).toBeTruthy();
    });
    it('should return false', () => {
      const mockCookieState = 'mockWrongState';
      const response = authService.verifyState(mockState, mockCookieState);
      expect(response).toBeFalsy();
    });
  });

  describe('createVerificationState', () => {
    const mockVerifierReturnValue = {
      code_verifier: 'mock_code_verifier',
      code_challenge: 'mock_code_challenge',
    };

    it('should match object', () => {
      jest.clearAllMocks();
      (getVerifier as jest.Mock).mockReturnValue(mockVerifierReturnValue);
      (getAppState as jest.Mock).mockReturnValue('mockAppState');
      const frontendParams = authService.createVerificationState();

      expect(frontendParams).toHaveProperty('client_id');
      expect(frontendParams).toHaveProperty('redirect_uri');
      expect(frontendParams).toHaveProperty('response_type');
      expect(frontendParams).toHaveProperty('code_verifier');
      expect(frontendParams).toHaveProperty('code_challenge');
      expect(frontendParams).toHaveProperty('code_challenge_method');
      expect(frontendParams).toHaveProperty('state');
      expect(frontendParams).toHaveProperty('scope');
      expect(frontendParams).toHaveProperty('display');
    });
  });

  describe('createJWTToken', () => {
    const mockUserId = 11111;
    const mockAdditionalParams = {
      first: 'first',
      second: 'second',
    };
    const expectedPayload = {
      sub: mockUserId,
      0: mockAdditionalParams.first,
      1: mockAdditionalParams.second,
    };
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mockToken');
    });

    it('should create a JWT token', async () => {
      const response = await authService.createJWTToken(mockUserId, {
        first: mockAdditionalParams.first,
        second: mockAdditionalParams.second,
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith(expectedPayload);
      expect(response).toEqual('mockToken');
    });
  });
});
