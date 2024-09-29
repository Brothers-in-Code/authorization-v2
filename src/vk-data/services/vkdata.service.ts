import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as qs from 'qs';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/db/services/user.service';

// TYPES
import { GroupGetResponseType } from 'src/types/vk-group-get-response-type';

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

    const params = {
      user_id: user_vkid,
      client_id: this.configService.get('vk.appId'),
      v: 5.199,
      extended: extended,
      access_token: user.access_token,
    };
    const response = await this.httpService.axiosRef.post<GroupGetResponseType>(
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

  async getWallPrivetGroup({
    user_vkid,
    owner_id,
    extended,
  }: {
    owner_id: number;
    extended: number;
    user_vkid: number;
  }) {
    const user = await this.userService.findOne(user_vkid);
    if (!user) {
      throw new Error(`User with id = ${user_vkid} not found`);
    }
    const access_token = user.access_token;
    const params = {
      owner_id: owner_id,
      client_id: this.configService.get('vk.appId'),
      v: 5.199,
      extended: extended,
      access_token,
    };
    const response = await this.httpService.axiosRef.post(
      `${VK_API}/wall.get`,
      qs.stringify(params),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return response.data;
  }

  async getWallByDomain({
    user_vkid,
    domain,
    extended,
  }: {
    user_vkid: number;
    domain: string;
    extended: number;
  }) {
    const user = await this.userService.findOne(user_vkid);
    if (!user) {
      throw new Error(`User with id = ${user_vkid} not found`);
    }
    const access_token = user.access_token;
    const params = {
      domain,
      client_id: this.configService.get('vk.appId'),
      v: 5.199,
      access_token,
      extended,
    };
    const response = await this.httpService.axiosRef.post(
      `${VK_API}/wall.get`,
      qs.stringify(params),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return response.data;
  }
}
