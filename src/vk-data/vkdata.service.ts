import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as qs from 'qs';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/db/services/user.service';

@Injectable()
export class VkDataService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async getUserGroupListFromVK(user_vkid: number) {
    const user = await this.userService.findOne(user_vkid);
    if (!user) {
      throw new Error(`User with id = ${user_vkid} not found`);
    }
    // TODO добавить проверку date_expires
    const access_token =
      'vk2.a.DIwa6Yql2YX8Rt-uAW4kURei9UcXx-9viNWIVnJBtu8ljHxaqttD94EkY3qjOVeCXxXh2tNoiqF12YRL0IaSe6kNQGxtIZ-Yw7lqWpKe__rAXmK3o6hROXQ0zFLq_FpbwGXvNEE2pKN6JGFDHjaNTwFiVFlCD1lO1ps6xmf6OspE1naPZikXr6lXbuAThONC1roDHxSAnuDY18y0WRztqdW3XiB4RgTC1jYxwBew3xUTMLSevrHh8-U9dIcDCWZR';

    const vk = this.configService.get('vk');
    const params = {
      client_id: vk.appId,
      //   access_token: user.access_token,
      access_token,
    };
    const response = await this.httpService.axiosRef.post(
      'https://id.vk.com/oauth2/groups',
      qs.stringify(params),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    return response;
  }
}

// {
//     "user_vkid": 1267318,
//     "access_token": "vk2.a.DIwa6Yql2YX8Rt-uAW4kURei9UcXx-9viNWIVnJBtu8ljHxaqttD94EkY3qjOVeCXxXh2tNoiqF12YRL0IaSe6kNQGxtIZ-Yw7lqWpKe__rAXmK3o6hROXQ0zFLq_FpbwGXvNEE2pKN6JGFDHjaNTwFiVFlCD1lO1ps6xmf6OspE1naPZikXr6lXbuAThONC1roDHxSAnuDY18y0WRztqdW3XiB4RgTC1jYxwBew3xUTMLSevrHh8-U9dIcDCWZR",
//     "refresh_token": "vk2.a.ka-hGYzOsKKdqx_5Dt3P_-Y4bQ3mXcJgAyvYlNcJu0BtPJM7v2u64CLC1QrQfrRSTLoiGlz71WLpCkPQYecNqklSiY9IjjZgXQEN1QwORttMiauGWMFf9lOQaiOAbIFX4wgCJj6COlvUcFOnSjxwyzfVAxDjjzkmLPBkei2Z9Krl7lQ-9v9DKWJFD5IpzY9LVmLJeAt4DwuUMlmsK3o2aeMGHLFHbHcIHNnywylB6TN1qpZrh21sz3hKmv-MlhT5",
//     "expires_date": "2024-09-24T18:45:55.843Z"
//   }
