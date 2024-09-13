import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

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

    const { codeVerifier, codeChallenge } = getVerifier();
    const state = getAppState();

    this.states.set(state, state);
    this.states.set('codeVerifier', codeVerifier);

    const frontend_params = {
      client_id: vk.appId,
      redirect_uri: app.frontend,
      response_type: 'code',
      code_verifier: codeVerifier,
      code_challenge: codeChallenge,
      code_challenge_method: 's256',
      state,
      scope: 'email',
      display: 'page',
    };

    return frontend_params;
  }

  verifyState(state) {
    return this.states.has(state);
  }

  async getAccessToken(code: string, device_id: string) {
    const vk = this.configService.get('vk');
    const app = this.configService.get('app');

    const url = 'https://id.vk.com/oauth2/auth';
    const params = {
      client_id: vk.appId,
      redirect_uri: app.frontend,
      grant_type: 'authorization_code',
      code,
      code_verifier: this.states.get('codeVerifier'),
      device_id,
    };

    Logger.log(params);

    const data = await this.httpService.get(url, { params }).toPromise();
    const { access_token } = data.data;
    Logger.log(data.data);
    return { message: data.data, access_token };
  }
}

// {
//     "client_id": "52279794",
//     "redirect_uri": "https://stay-in-touch.ru/home",
//     "response_type": "code",
//     "code_verifier": "9b075c395bc53137d3899381701491012dcd2ee3d6fd01c375c28cde152bfe2832e4f62a99e3d4569aa6419665",
//     "code_challenge": "ed8c1cd752cb20632f4c24e296da0937e4acd1a6ac90c9a931e52c02222b957b",
//     "code_challenge_method": "s256",
//     "state": "9a74ac0386f2d0585339586dd9d1ab6503a4be8e0e907bddab9e5969d3baeb1c",
//     "scope": "email",
//     "display": "page"
//   }

// {
//     "code":"vk2.a.r0wtwZmA8voPOQZzjT8kXqLxr7jDx8nEmE7k33AlxCMQSlXuuBfFJ95yvG-qDYWt9j3xHg5_OK1nyd3gyHavW1r_i1YAQDoRM7K5vKYhIjss03YxkAqrntF6bwxxbRt1IiUurbRaMXybqUF0oXNyav7vOvl40ZLE6z2ff0aEHWSJ23jYmJ8lwUIBKGfP77Z6mMdYjlMWhPL1Mu8i3DdHeA",
//     "state":"9a74ac0386f2d0585339586dd9d1ab6503a4be8e0e907bddab9e5969d3baeb1c",
//     "device_id":"VlfqcM5uMw5e9nuOYTV1AOUovpDm8XkndFUHHc4H44pav9D6Tp4I2mI7KGjfYtgNPwRDbZPGou_fdxmOsTqssg"
// }

// const params = {
//   client_id: 52279794,
//   redirect_uri: 'https://stay-in-touch.ru/home',
//   grant_type: 'authorization_code',
//   code: 'vk2.a.r0wtwZmA8voPOQZzjT8kXqLxr7jDx8nEmE7k33AlxCMQSlXuuBfFJ95yvG-qDYWt9j3xHg5_OK1nyd3gyHavW1r_i1YAQDoRM7K5vKYhIjss03YxkAqrntF6bwxxbRt1IiUurbRaMXybqUF0oXNyav7vOvl40ZLE6z2ff0aEHWSJ23jYmJ8lwUIBKGfP77Z6mMdYjlMWhPL1Mu8i3DdHeA',
//   code_verifier:
//     '9b075c395bc53137d3899381701491012dcd2ee3d6fd01c375c28cde152bfe2832e4f62a99e3d4569aa6419665',
//   device_id:
//     'VlfqcM5uMw5e9nuOYTV1AOUovpDm8XkndFUHHc4H44pav9D6Tp4I2mI7KGjfYtgNPwRDbZPGou_fdxmOsTqssg',
// };
