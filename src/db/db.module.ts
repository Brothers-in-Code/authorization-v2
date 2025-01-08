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
import { ReportCommentService } from './services/report-comment.service';
import { UserReportService } from './services/user-report.service';
import { PostIndicators } from 'src/db/entities/postIndicators.entity';
import { PostIndicatorsService } from 'src/db/services/post-indicators.service';
import { RbSubscriptionType } from 'src/db/entities/rb-subscription-type.entity';

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
      PostIndicators,
      RbSubscriptionType,
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
    ReportCommentService,
    UserReportService,
    PostIndicatorsService,
  ],
  exports: [
    PostService,
    UserService,
    GroupService,
    UserGroupService,
    UserSubscriptionService,
    CommentService,
    ReportService,
    ReportCommentService,
    UserReportService,
    PostIndicatorsService,
  ],
})
export class DBModule {}
