import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Group } from 'src/db/entities/group.entity';
import { GroupService } from 'src/db/services/group.service';
import { PostService } from 'src/db/services/post.service';
import { UserGroupService } from 'src/db/services/user-group.service';
import { UserService } from 'src/db/services/user.service';

@Injectable()
export class WorkSpaceService {
  constructor(
    private readonly groupService: GroupService,
    private readonly userService: UserService,
    private readonly userGroupService: UserGroupService,
    private readonly postService: PostService,
  ) {}

  async getGroupList(
    user_id: number,
    offset: number,
    limit: number,
    is_scan?: number,
  ) {
    const user = await this.userService.findOneById(user_id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const params = {
      user_vkid: user.user_vkid,
      offset,
      limit,
    };

    if (is_scan !== undefined) {
      params['is_scan'] = is_scan;
    }

    const response = await this.userGroupService.findUsersGroupList(params);
    return response;
  }

  async getPostList(groupList: Group[]) {
    const response = await this.postService.findPostsByGroupList(groupList);
    return response;
  }
}
