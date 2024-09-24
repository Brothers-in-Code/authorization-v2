import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { VkDataService } from './vkdata.service';

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
}
