import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostService } from 'src/db/services/post.service';
import { Post } from 'src/db/entities/post.entity';
import { User } from 'src/db/entities/user.entity';

import { UserService } from 'src/db/services/user.service';

import { GroupService } from './services/group.service';
import { Group } from './entities/group.entity';
import { UserGroupService } from './services/user-group.service';
import { UserGroup } from './entities/user_group.entity';
import { UserPermissionService } from './services/user-permission.service';
import { UserPermission } from './entities/user_permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Group, UserGroup, UserPermission]),
  ],

  providers: [
    PostService,
    UserService,
    GroupService,
    UserGroupService,
    UserPermissionService,
  ],
  exports: [
    PostService,
    UserService,
    GroupService,
    UserGroupService,
    UserPermissionService,
  ],
})
export class DBModule {}
