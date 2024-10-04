// TODO если только для внутреннего использования - удалить

import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
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

@Controller('vkdata')
export class VkDataController {
  constructor(
    private readonly vkDataService: VkDataService,
    private readonly userService: UserService,
    private readonly userGroupService: UserGroupService,
  ) {}

  @Post('groups')
  async getUserGroups(
    @Body()
    { user_vkid, extended = 1 }: { user_vkid: number; extended?: number },
  ) {
    try {
      const data = await this.vkDataService.getUserGroupListFromVK(
        user_vkid,
        extended,
      );
      // NOTE для тестирования
      // TODO удалить после проверки работоспособности
      const user = await this.userService.findOne(user_vkid);
      const groupList = await this.vkDataService.saveGroupList(
        data.response.items.map((item) => item),
      );
      await this.userGroupService.createUserGroupList(user, groupList);

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
    }: {
      user_vkid: number;
      owner_id: number;
      extended?: number;
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
      const data = await this.vkDataService.getWallPrivetGroup({
        access_token: user.access_token,
        owner_id,
        extended,
      });
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
