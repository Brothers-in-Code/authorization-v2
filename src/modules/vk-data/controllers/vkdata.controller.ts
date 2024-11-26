// TODO если только для внутреннего использования - удалить

import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { VkDataService } from '../services/vkdata.service';
import { UserGroupService } from 'src/db/services/user-group.service';
import { UserService } from 'src/db/services/user.service';

/*
TODO сделать обработчик ошибок
общие ошибки: https://dev.vk.com/ru/reference/errors
ошибки запроса к группам пользователя: https://dev.vk.com/ru/method/groups.get#%D0%9A%D0%BE%D0%B4%D1%8B%20%D0%BE%D1%88%D0%B8%D0%B1%D0%BE%D0%BA
ошибки запроса к стене группы: https://dev.vk.com/ru/method/wall.get#%D0%9A%D0%BE%D0%B4%D1%8B%20%D0%BE%D1%88%D0%B8%D0%B1%D0%BE%D0%BA
*/

@Controller('api/vkdata')
export class VkDataController {
  constructor(
    private readonly vkDataService: VkDataService,
    private readonly userService: UserService,
  ) {}

  @Post('groups')
  async getUserGroups(
    @Body()
    { user_vkid, extended = 1 }: { user_vkid: number; extended?: number },
  ) {
    try {
      const user = await this.userService.findOne(user_vkid);
      if (!user) {
        throw new Error(`User with id = ${user_vkid} not found`);
      }
      const data = await this.vkDataService.getUserGroupListFromVK(
        user_vkid,
        user.access_token,
        extended,
      );

      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('wall')
  async getWallGroup(
    @Body()
    {
      user_vkid,
      owner_id,
      extended = 0,
      count = 30, // NOTE count - количество получаемых постов за один запрос
      offset = 0,
    }: {
      user_vkid: number;
      owner_id: number;
      extended?: number;
      count?: number;
      offset?: number;
    },
  ) {
    const user = await this.userService.findOne(user_vkid);
    if (!user) {
      throw new Error(`User with id = ${user_vkid} not found`);
    }
    try {
      //   const data = await this.vkDataService.getWallPublicGroup(
      //     owner_id,
      //     extended,
      //   );
      const result = await this.vkDataService.getWallPrivetGroup({
        access_token: user.access_token,
        owner_id,
        extended,
        count,
        offset,
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
