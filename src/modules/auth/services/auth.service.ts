import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as qs from 'qs';
import { getVerifier, getAppState } from 'src/utils/verifiers';
import { UserService } from 'src/db/services/user.service';

import { VKResponseTokenType } from 'src/types/vk-refresh-token-type';
import { VKResponseAuthErrorType } from 'src/types/vk-error-type';
import { VK_API_Error, VK_AUTH_Error } from 'src/errors/vk-errors';
import { DatabaseServiceError } from 'src/errors/service-errors';
import { VKUserInfoType } from 'src/types/vk-user-info-type';
import { JwtService } from '@nestjs/jwt';

type getAccessTokenOutputType = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user_id: number;
  id_token: string;
  device_id: string;
};

type RefreshTokenOutputType = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

const AUTH_API = 'https://id.vk.com/oauth2';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  createVerificationState() {
    const vk = this.configService.get('vk');
    const app = this.configService.get('app');

    const { code_verifier, code_challenge } = getVerifier();
    const state = getAppState();

    const frontend_params = {
      client_id: vk.appId,
      redirect_uri: app.frontend,
      response_type: 'code',
      code_verifier,
      code_challenge,
      code_challenge_method: 's256',
      state,
      scope: 'groups email',
      display: 'page',
    };

    return frontend_params;
  }

  verifyState(state: string, cookieState: string) {
    return cookieState === state;
  }

  async createJWTToken(userId: number, tokenData: object): Promise<string> {
    const payload = {
      sub: userId,
      ...tokenData,
    };
    return await this.jwtService.signAsync(payload);
  }

  /**
   * getAccessToken
   * @param code
   * @param device_id
   * @param code_verifier
   * @returns {Promise<getAccessTokenOutputType>}
   */

  async getAccessToken(
    code: string,
    device_id: string,
    code_verifier: string,
  ): Promise<getAccessTokenOutputType> {
    const authorization_params = {
      grant_type: 'authorization_code',
      code,
      device_id,
      client_id: this.configService.get('vk.appId'),
      redirect_uri: this.configService.get('app.frontend'),
      code_challenge_method: 's256',
      code_verifier,
      scope: 'groups email',
    };

    const response = await this.httpService.axiosRef.post(
      `${AUTH_API}/auth`,
      qs.stringify(authorization_params),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    if (!response.data.hasOwnProperty('access_token')) {
      const error = response.data as unknown as VKResponseAuthErrorType;
      throw new UnauthorizedException(
        `access_token не получен. ${error.error_description}`,
      );
    }

    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
      id_token: response.data.id_token,
      user_id: response.data.user_id,
      device_id,
    };
  }

  async refreshAccessToken(
    refresh_token: string,
    device_id: string,
  ): Promise<RefreshTokenOutputType> {
    const state = getAppState();
    const refresh_params = {
      grant_type: 'refresh_token',
      refresh_token,
      client_id: this.configService.get('vk.appId'),
      state,
      scope: ['groups, email'],
      device_id,
    };

    const response = await this.httpService.axiosRef.post<VKResponseTokenType>(
      `${AUTH_API}/auth`,
      qs.stringify(refresh_params),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    if (response.data.hasOwnProperty('error')) {
      const error = response.data as unknown as VKResponseAuthErrorType;
      throw new VK_AUTH_Error(
        `access_token не получен. ${error.error_description}`,
      );
    }

    if (response.data.hasOwnProperty('access_token')) {
      if (state !== response.data.state) {
        throw new UnauthorizedException(
          `state не совпадает. local_state: ${state}, vk_state: ${response.data.state}`,
        );
      }

      return {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_in: response.data.expires_in,
      };
    }
  }

  async getUserInfo(access_token: string) {
    const info_params = {
      access_token,
      client_id: this.configService.get('vk.appId'),
      scope: 'email',
    };

    const response = await this.httpService.axiosRef.post<VKUserInfoType>(
      `${AUTH_API}/user_info`,
      qs.stringify(info_params),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    if (response.data.hasOwnProperty('error')) {
      const error = response.data as unknown as VKResponseAuthErrorType;
      throw new VK_API_Error(
        `user_info не получен. ${error.error_description}`,
      );
    }

    return response.data;
  }

  async saveUser(
    user_vkid: number,
    access_token: string,
    refresh_token: string,
    device_id: string,
    expires_date: Date,
  ) {
    const user = await this.userService.findOne(user_vkid);
    const params = {
      user_vkid,
      access_token,
      refresh_token,
      device_id,
      expires_date,
    };

    if (user) {
      const updatedUser = await this.userService.updateToken(params);
      if (!updatedUser) {
        throw new DatabaseServiceError(
          `func: saveUser. Не удалось обновить токен пользователя ${user_vkid}`,
        );
      }
      return updatedUser;
    } else {
      const newUser = await this.userService.createUser(params);
      if (!newUser) {
        throw new DatabaseServiceError(
          `func: saveUser. Не удалось создать пользователя ${user_vkid}`,
        );
      }
      return newUser;
    }
  }

  calcExpiresDate(expires_in: number) {
    const RESPONSE_DELAY = 200;
    const expires_date = new Date();
    expires_date.setSeconds(
      expires_date.getSeconds() + expires_in - RESPONSE_DELAY,
    );
    return expires_date;
  }
}
