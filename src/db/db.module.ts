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
import { CommentService } from './services/comment.service';
import { Comment } from './entities/comment.entity';
import { ReportComment } from './entities/report_comment.entity';
import { UserReport } from './entities/user_report.entity';
import { Report } from './entities/report.entity';
import { ReportService } from './services/report.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      User,
      Group,
      UserGroup,
      UserSubscription,
      Comment,
      Report,
      ReportComment,
      UserReport,
    ]),
  ],

  providers: [
    PostService,
    UserService,
    GroupService,
    UserGroupService,
    UserSubscriptionService,
    CommentService,
    ReportService,
  ],
  exports: [
    PostService,
    UserService,
    GroupService,
    UserGroupService,
    UserSubscriptionService,
    CommentService,
    ReportService,
  ],
})
export class DBModule {}
