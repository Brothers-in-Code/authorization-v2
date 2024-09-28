import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { VkDataService } from './vkdata.service';

/*
TODO сделать обработчик ошибок
общие ошибки: https://dev.vk.com/ru/reference/errors
ошибки запроса к группам пользователя: https://dev.vk.com/ru/method/groups.get#%D0%9A%D0%BE%D0%B4%D1%8B%20%D0%BE%D1%88%D0%B8%D0%B1%D0%BE%D0%BA
ошибки запроса к стене группы: https://dev.vk.com/ru/method/wall.get#%D0%9A%D0%BE%D0%B4%D1%8B%20%D0%BE%D1%88%D0%B8%D0%B1%D0%BE%D0%BA
*/

@Controller('vkdata')
export class VkDataController {
  constructor(private readonly vkDataService: VkDataService) {}

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
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('wall')
  async getWallGroup(
    @Body()
    { owner_id, extended = 1 }: { owner_id: number; extended?: number },
  ) {
    try {
      //   const data = await this.vkDataService.getWallPublicGroup(
      //     owner_id,
      //     extended,
      //   );
      const data = await this.vkDataService.getWallPrivetGroup(
        owner_id,
        extended,
        1267318,
      );
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
