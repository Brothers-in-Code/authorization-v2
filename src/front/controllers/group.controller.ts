import { Controller, Get } from '@nestjs/common';
import { GroupService } from 'src/db/services/group.service';
import { UserGroupService } from 'src/db/services/user-group.service';

@Controller('group')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly userGroupService: UserGroupService,
  ) {}

  @Get()
  findAll() {
    return this.userGroupService.findAll();
  }
}
