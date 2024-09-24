import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as qs from 'qs';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/db/services/user.service';

const VK_API = 'https://api.vk.com/method';

@Injectable()
export class VkDataService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async getUserGroupListFromVK(user_vkid: number, extended: number) {
    const user = await this.userService.findOne(user_vkid);
    if (!user) {
      throw new Error(`User with id = ${user_vkid} not found`);
    }
    // TODO добавить проверку date_expires
    const access_token =
      'vk2.a.LVui3YEALZzKwvaljaQRbQ7ANKjP7HGYpPmtv4hdIyHC8TB4nzJpPtE_pH1nkKEte57zgGEQYlS6dWsajOUDNf6aw74QvWJTnwcesCzGRe6X76aLFmAV8056zQmJ93WpJEchA3URO0dJnUTcNpeZ0CmIbE5K3UiFH9_qtphczgMsAR2_WaJuAbS5_snWXJE7JmzQZZIgIV0rLBxGHc74t9Gx88v4GXAhLdDPMHyLSvbPMsycq3x2BGhjYwhmNutz';

    const params = {
      user_id: user_vkid,
      client_id: this.configService.get('vk.appId'),
      v: 5.199,
      extended: extended,
      //   access_token: user.access_token,
      access_token,
    };
    const response = await this.httpService.axiosRef.post(
      `${VK_API}/groups.get`,
      qs.stringify(params),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    return response.data;
  }

  async getWallPublicGroup(owner_id: number, extended: number) {
    const params = {
      owner_id: -owner_id,
      client_id: this.configService.get('vk.appId'),
      v: 5.199,
      extended: extended,
    };
    const response = await this.httpService.axiosRef.post(
      `${VK_API}/wall.get`,
      qs.stringify(params),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${this.configService.get('vk.serviceKey')}`,
        },
      },
    );
    return response.data;
  }
}

// {
//     "user_vkid": 1267318,
//     "access_token": "vk2.a.LVui3YEALZzKwvaljaQRbQ7ANKjP7HGYpPmtv4hdIyHC8TB4nzJpPtE_pH1nkKEte57zgGEQYlS6dWsajOUDNf6aw74QvWJTnwcesCzGRe6X76aLFmAV8056zQmJ93WpJEchA3URO0dJnUTcNpeZ0CmIbE5K3UiFH9_qtphczgMsAR2_WaJuAbS5_snWXJE7JmzQZZIgIV0rLBxGHc74t9Gx88v4GXAhLdDPMHyLSvbPMsycq3x2BGhjYwhmNutz",
//     "refresh_token": "vk2.a.1bTdHzvwDBptIINQ-SYk3QaQ6V1N_73C399BzxUYOyR3zH5T63i0Vx1840uwAR1I-gzBa6Xz6bCIyd4kGjCiuLqAeY7X--t8EMt4I39E4-DzogvQTgde1m9uphEvLgX2xEflrgJuCmnI7kKIGJWMM0kyqwF0G9dKEYDkYr_qnu5u7WjSjVlNMT15nk8z_9UEN8Wz6Uq8o37OS9iG44r3W8RMWCkKSWHC37bkepqbpe8",
//     "expires_date": "2024-09-24T20:19:51.438Z"
//   }
