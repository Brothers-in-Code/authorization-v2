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
import { UserSubscriptionService } from './services/user-subscription.service';
import { UserSubscription } from './entities/user_subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Group, UserGroup, UserSubscription]),
  ],

  providers: [
    PostService,
    UserService,
    GroupService,
    UserGroupService,
    UserSubscriptionService,
  ],
  exports: [
    PostService,
    UserService,
    GroupService,
    UserGroupService,
    UserSubscriptionService,
  ],
})
export class DBModule {}
