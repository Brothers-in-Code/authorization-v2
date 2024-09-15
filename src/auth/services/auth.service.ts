import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as qs from 'qs';
import { getVerifier, getAppState } from 'src/utils/verifiers';

@Injectable()
export class AuthService {
  private states: Map<string, string> = new Map();

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  createVerificationState() {
    const vk = this.configService.get('vk');
    const app = this.configService.get('app');

    const { code_verifier, code_challenge } = getVerifier();
    const state = getAppState();

    this.states.set('state', state);
    this.states.set('code_verifier', code_verifier);

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

  verifyState(state) {
    return this.states.get('state') === state;
  }

  //   NOTE code_challenge не нужен, но на всякий случай оставил
  async getAccessToken(code: string, device_id: string) {
    const vk = this.configService.get('vk');
    const app = this.configService.get('app');

    const code_verifier = this.states.get('code_verifier');

    const authorization_params = {
      grant_type: 'authorization_code',
      code,
      device_id,
      client_id: vk.appId,
      redirect_uri: app.frontend,
      code_challenge_method: 's256',
      code_verifier,
    };

    const data = await this.httpService.axiosRef.post(
      'https://id.vk.com/oauth2/auth',
      qs.stringify(authorization_params),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    const { access_token } = data.data;

    Logger.log(data.data);
    return { message: data.data, access_token };
  }
}
