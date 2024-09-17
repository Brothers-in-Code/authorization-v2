import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as qs from 'qs';
import { getVerifier, getAppState } from 'src/utils/verifiers';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
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
      scope: 'email',
      display: 'page',
    };

    return frontend_params;
  }

  verifyState(state: string, cookieState: string) {
    return cookieState === state;
  }

  async getAccessToken(code: string, device_id: string, code_verifier: string) {
    const vk = this.configService.get('vk');
    const app = this.configService.get('app');

    const authorization_params = {
      grant_type: 'authorization_code',
      code,
      device_id,
      client_id: vk.appId,
      redirect_uri: app.frontend,
      code_challenge_method: 's256',
      code_verifier,
    };

    const response = await this.httpService.axiosRef.post(
      'https://id.vk.com/oauth2/auth',
      qs.stringify(authorization_params),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    if (!response.data.hasOwnProperty('access_token')) {
      this.logger.log(`access_token не получен. ${response.data}`);
      throw new UnauthorizedException(
        `access_token не получен. ${response.data}`,
      );
    }
    return { message: response.data };
  }
}
