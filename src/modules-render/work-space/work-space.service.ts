import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupService } from 'src/db/services/group.service';
import { UserGroupService } from 'src/db/services/user-group.service';
import { UserService } from 'src/db/services/user.service';

@Injectable()
export class WorkSpaceService {
  constructor(
    private readonly groupService: GroupService,
    private readonly userService: UserService,
    private readonly userGroupService: UserGroupService,
  ) {}

  async getGroupList(user_id: number) {
    const user = await this.userService.findOneById(user_id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    const response = await this.userGroupService.findUsersGroupList(
      user.user_vkid,
    );
    return response.groups;
  }
}
