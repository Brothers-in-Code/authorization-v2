import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { GroupService } from 'src/db/services/group.service';
import { UserGroupService } from 'src/db/services/user-group.service';
import { UserService } from 'src/db/services/user.service';
import { VkDataService } from 'src/modules/vk-data/services/vkdata.service';

@Controller('api/user-work-group')
export class UserWorkGroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly userGroupService: UserGroupService,
    private readonly userService: UserService,
    private readonly vkDataService: VkDataService,
  ) {}

  //   TODO сделать limit и offset
  @Get(':id')
  findAll(@Param('id') user_vkid: number): Promise<any> {
    return this.userGroupService.getUsersGroupList({
      user_vkid,
      offset: 0,
      limit: 20,
    });
  }

  @Get('group/:id')
  async findOne(@Param('id') group_vkid: number) {
    const group = await this.groupService.findOne(group_vkid);

    if (!group) {
      throw new NotFoundException(`Group id: ${group_vkid} not found`);
    }
    return group;
  }

  @Post(':id')
  async addGroupToUser(
    @Param('id') user_vkid: number,
    @Body() { domain, extended = 1 }: { domain: string; extended?: number },
  ): Promise<any> {
    const user = await this.userService.findOne(user_vkid);
    if (!user) {
      throw new NotFoundException(`User id: ${user_vkid} not found`);
    }

    const group = false;
    if (!group) {
      const data = await this.vkDataService.getWallByDomain({
        user_vkid,
        domain,
        extended,
      });
      return data;
    }
    return 'test';
  }
}
