import { Controller, Get, Logger, Param } from '@nestjs/common';
import { GroupService } from 'src/db/services/group.service';
import { UserGroupService } from 'src/db/services/user-group.service';

@Controller('user-work-group')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly userGroupService: UserGroupService,
  ) {}

  @Get(':id')
  findAll(@Param('id') user_vkid: number): Promise<any> {
    return this.userGroupService.findUsersGroupList(user_vkid);
  }
}
