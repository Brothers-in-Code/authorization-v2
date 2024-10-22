import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { of } from 'rxjs';
import { CommentService } from 'src/db/services/comment.service';
import { PostService } from 'src/db/services/post.service';
import { ReportService } from 'src/db/services/report.service';
import { UserGroupService } from 'src/db/services/user-group.service';
import { UserService } from 'src/db/services/user.service';
import { VkDataService } from 'src/modules/vk-data/services/vkdata.service';
import { VKGroupType } from 'src/types/vk-group-get-response-type';

@Injectable()
export class WorkSpaceService {
  constructor(
    private readonly userService: UserService,
    private readonly userGroupService: UserGroupService,
    private readonly postService: PostService,
    private readonly vkDataService: VkDataService,
    private readonly commentService: CommentService,
    private readonly reportService: ReportService,
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
    user_id: number,
    data: {
      reportId: number;
      postList: { post_id: number; comment: string }[];
    },
  ) {
    const user = await this.userService.findOneById(user_id);
    if (!user) {
      throw new NotFoundException(
        `func: saveComment. Пользователь ${user_id} не найден`,
      );
    }

    const commentList = [];
    for (const item of data.postList) {
      const post = await this.postService.findOne(item.post_id);
      if (!post) {
        throw new NotFoundException(
          `func: saveComment. Пост ${item.post_id} не найден`,
        );
      }
      const newComment = await this.commentService.createCommentObj();
      newComment.user = user;
      newComment.post = post;
      newComment.text = item.comment;
      commentList.push(newComment);
    }

    return await this.commentService.createCommentList(
      data.reportId,
      commentList,
    );
  }

  async collectDataToRender(
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

    const postList = await this.getPostList({
      user_id: Number(userId),
      offset: Number(data.offset),
      limit: Number(data.limit),
      likesMin,
      viewsMin,
      begDate,
      endDate,
    });

    return {
      pageTitle: 'Посты',
      userId: userId,
      currentPage: 'posts',
      reportList: ['Отчеты', 'Все отчеты'],
      postList,
      likesMin,
      viewsMin,
      begDate: data.begDate,
      endDate: data.endDate,
    };
  }
}
