import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { getVerifier, getAppState } from 'src/utils/verifiers';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  sendVerificationState() {
    const vk = this.configService.get('vk');
    const app = this.configService.get('app');

    const { codeVerifier, codeChallenge } = getVerifier();
    const state = getAppState();

    const params = {
      app: vk.appId,
      redirectUrl: app.frontend,
      scope: 'email',
      response_type: 'code',
      codeVerifier,
      codeChallenge,
      code_challenge_method: 's256',
      state,
    };

    return params;
  }
}
