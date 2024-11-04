import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CommentService } from 'src/db/services/comment.service';
import { PostService } from 'src/db/services/post.service';
import { ReportCommentService } from 'src/db/services/report-comment.service';
import { ReportService } from 'src/db/services/report.service';
import { UserGroupService } from 'src/db/services/user-group.service';
import { UserReportService } from 'src/db/services/user-report.service';
import { UserService } from 'src/db/services/user.service';
import { VkDataService } from 'src/modules/vk-data/services/vkdata.service';
import { VKGroupType } from 'src/types/vk-group-get-response-type';
import { InsertResult } from 'typeorm';

@Injectable()
export class WorkSpaceService {
  constructor(
    private readonly userService: UserService,
    private readonly userGroupService: UserGroupService,
    private readonly postService: PostService,
    private readonly vkDataService: VkDataService,
    private readonly commentService: CommentService,
    private readonly reportService: ReportService,
    private readonly reportCommentService: ReportCommentService,
    private readonly userReportService: UserReportService,
  ) {}

  private readonly logger = new Logger(WorkSpaceService.name);

  async getGroupList(data: {
    user_id: number;
    offset: number;
    limit: number;
    is_scan?: number;
    filterGroupByIdOrName?: string;
  }) {
    const user = await this.userService.findOneById(data.user_id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const params = {
      user_vkid: user.user_vkid,
      offset: data.offset,
      limit: data.limit,
    };

    if (data.is_scan !== undefined) {
      params['is_scan'] = data.is_scan;
    }

    if (data.filterGroupByIdOrName !== '') {
      if (!isNaN(Number(data.filterGroupByIdOrName))) {
        params['group_vkid'] = Number(data.filterGroupByIdOrName);
      } else if (typeof data.filterGroupByIdOrName === 'string') {
        params['name'] = data.filterGroupByIdOrName;
      }
    }

    const response = await this.userGroupService.getUsersGroupList(params);
    return response;
  }

  /**
 * getPostList
 *  @param user_id: number;
    @param offset: number;
    @param limit: number;
    @param likesMin?: number;
    @param viewsMin?: number;
    @param begDate?: number;  в виде timestamp
    @param endDate?: number;  в виде timestamp
 */

  // TODO отдавать только посты групп, отмеченных к сканированию
  async getPostList(data: {
    user_id: number;
    offset: number;
    limit: number;
    likesMin?: number;
    viewsMin?: number;
    begDate?: number;
    endDate?: number;
  }) {
    const { user_id, offset, limit } = data;
    const groupList = await this.userGroupService.findAllByUser(user_id);
    const response = await this.postService.getPostsByGroupList({
      groupList,
      offset,
      limit,
      likesMin: data.likesMin ?? undefined,
      viewsMin: data.viewsMin ?? undefined,
      begDate: data.begDate ?? undefined,
      endDate: data.endDate ?? undefined,
    });
    return response;
  }

  async addGroupToUser(user_id: number, data: { groupIdOrDomain: string }) {
    const user = await this.userService.findOneById(user_id);
    if (!user) {
      throw new NotFoundException(
        'func: addGroupToUser. Пользователь не найден',
      );
    }

    // TODO выполнить поиск группы в БД
    if (!isNaN(Number(data.groupIdOrDomain))) {
      //   this.logger.debug('number');
    } else if (typeof data.groupIdOrDomain === 'string') {
      //   this.logger.debug('string');
    }

    // TODO проверить наличие error в response
    const response = await this.vkDataService.getGroupInfo(user.access_token, [
      data.groupIdOrDomain,
    ]);

    const vkGroupList: VKGroupType[] = response.response.groups.map((item) => ({
      id: item.id,
      is_closed: item.is_closed,
      name: item.name,
      screen_name: item.screen_name,
      photo_50: item.photo_50,
      photo_100: item.photo_100,
      photo_200: item.photo_200,
      type: item.type,
    }));

    const newGroupList = await this.vkDataService.saveGroupList(vkGroupList);
    const newUserGroupList = await this.userGroupService.createUserGroupList(
      user,
      newGroupList,
    );
    // TODO сделать сообщения о сохранении и о наличии группы в списке пользователя
    return newUserGroupList;
  }

  async saveReport(reportName: string, reportDescription: string) {
    return await this.reportService.create(reportName, reportDescription);
  }

  async saveComment(
    userId: number,
    data: {
      reportId: number;
      postList: { post_id: number; comment: string }[];
    },
  ): Promise<InsertResult> {
    let currentPostList: { post_id: number; comment: string }[] = [];

    const existingCommentsOfReport =
      await this.reportCommentService.checkCommentsOfReport(
        data.reportId,
        data.postList.map((item) => item.post_id),
      );

    if (existingCommentsOfReport.length > 0) {
      currentPostList = data.postList.filter(
        (item) => !existingCommentsOfReport.includes(item.post_id),
      );
    } else {
      currentPostList = data.postList;
    }

    return await this.commentService.createCommentList({
      userId,
      postList: currentPostList,
    });
  }

  addReportToUser(userId: number, reportId: number) {
    return this.userReportService.create({ userId, reportId });
  }

  async addCommentToReport(reportId: number, commentIdList: number[]) {
    return this.reportCommentService.createList(reportId, commentIdList);
  }

  async collectPostDataToRender(
    userId,
    data: {
      offset: string | number;
      limit: string | number;
      likesMin: string;
      viewsMin: string;
      begDate: string;
      endDate: string;
    },
  ) {
    const likesMin = data.likesMin ? Number(data.likesMin) : undefined;
    const viewsMin = data.viewsMin ? Number(data.viewsMin) : undefined;
    const begDate = data.begDate ? new Date(data.begDate).getTime() : undefined;
    const endDate = data.endDate ? new Date(data.endDate).getTime() : undefined;

    // TODO отдавать только посты групп, отмеченных к сканированию
    const postList = await this.getPostList({
      user_id: Number(userId),
      offset: Number(data.offset),
      limit: Number(data.limit),
      likesMin,
      viewsMin,
      begDate,
      endDate,
    });

    const reportList = await this.userReportService
      .getUserReportList(userId)
      .then((data) => data.reportList.map((report) => report))
      .catch((err) => {
        this.logger.error(err);
        return [];
      });

    return {
      pageTitle: 'Посты',
      userId: userId,
      currentPage: 'posts',
      reportList,
      postList,
      likesMin,
      viewsMin,
      begDate: data.begDate,
      endDate: data.endDate,
    };
  }

  async collectGroupDataToRender(
    userId: string,
    data: {
      offset: string | number;
      limit: string | number;
      isScan: string;
      filterGroupByIdOrName: string;
    },
  ) {
    const isScan = isNaN(Number(data.isScan)) ? undefined : Number(data.isScan);
    const filterGroupByIdOrName = data.filterGroupByIdOrName || '';

    const userGroupList = await this.getGroupList({
      user_id: Number(userId),
      offset: Number(data.offset),
      limit: Number(data.limit),
      is_scan: isScan,
      filterGroupByIdOrName,
    });

    return {
      pageTitle: 'Группы ВК',
      userId: userId,
      currentPage: 'groups',
      currentIsScan: data.isScan,
      filterGroupByIdOrName,
      userGroupList,
    };
  }

  async collectReportDataToRender(
    userId: string,
    data: {
      offset: string | number;
      limit: string | number;
    },
  ) {
    const reportList = await this.userReportService.getUserReportExtendedList({
      userId: Number(userId),
      offset: Number(data.offset),
      limit: Number(data.limit),
    });

    return {
      pageTitle: 'Отчёты',
      userId: userId,
      currentPage: 'reports',
      reportList,
    };
  }
}
