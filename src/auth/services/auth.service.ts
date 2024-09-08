import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async signIn(code) {
    const appSettings = this.configService.get('app');
    const vk = this.configService.get('vk');

    const params = {
      code,
      client_id: vk.appId,
      client_secret: vk.serviceKey,
      redirect_uri: `${appSettings.protocol}://${appSettings.host}/auth/login/vk`,
    };

    const userData = await this.httpService
      .get('https://oauth.vk.com/access_token', { params })
      .toPromise();

    return userData.data;
  }
}
