import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as qs from 'qs';

import { ConfigService } from '@nestjs/config';

import { VKResponseApiErrorType } from 'src/types/vk-error-type';
import { PostType, VKWallType } from 'src/types/vk-wall-type';
import { VK_API } from 'src/modules/vk-data/constants';
import { VK_API_Error } from 'src/errors/vk-errors';
import { DatabaseServiceError } from 'src/errors/service-errors';
import { PostService } from 'src/db/services/post.service';
import { GroupService } from 'src/db/services/group.service';

type ResponsePostListType = {
  offset: number;
  data: {
    response: {
      count: number;
      items: PostType[];
    };
  };
};

@Injectable()
export class VkWallDataService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly groupService: GroupService,
    private readonly postService: PostService,
  ) {}

  private readonly logger = new Logger(VkWallDataService.name);

  async getWallPosts(params: {
    accessToken: string;
    groupVKId: number;
    daysLimit: number;
  }) {
    const { accessToken, groupVKId, daysLimit } = params;
    const COUNT = 30;
    let errorsCounter = 0;
    const limitTimestamp = this.calcLimitTimestamp(daysLimit);

    let currentOffset = 0;
    let currentPostTimestamp = new Date().getTime();
    let isSaveSuccess = false;

    while (currentPostTimestamp >= limitTimestamp) {
      let responsePostList: ResponsePostListType;

      try {
        responsePostList = await this.getPostList({
          access_token: accessToken,
          owner_id: groupVKId,
          extended: 0,
          count: COUNT,
          offset: currentOffset,
        });
        const { offset, data } = responsePostList;

        this.logger.log(`получен посты группы groupVKId = ${groupVKId}`);

        if (data.response.items && data.response.items.length > 0) {
          const postParamsList = data.response.items.map((item) => {
            return {
              post_vkid: item.id,
              likes: item.likes?.count || 0,
              views: item.views?.count || 0,
              comments: item.comments.count || 0,
              timestamp_post: item.date,
              json: item,
            };
          });
          const postResponse = await this.savePostList(
            groupVKId,
            postParamsList,
          );

          if (postResponse) {
            this.logger.log(
              `посты группы groupVKId = ${groupVKId} сохранены. offset = ${currentOffset}`,
            );
            isSaveSuccess = true;
          }

          currentOffset = offset + COUNT;
          currentPostTimestamp =
            data.response.items[data.response.items.length - 1].date * 1000;
        } else {
          this.logger.log(
            `Нет новых постов для группы groupVKId = ${groupVKId}`,
          );
          break;
        }
      } catch (error) {
        if (error.response && error.response.data) {
          this.logger.error(error.response.data);
        }
        errorsCounter++;
        this.logger.error(
          `ошибка ПОЛУЧЕНИЯ или СОХРАНЕНИЯ постов группы ${groupVKId}: ${error}`,
        );
        break;
      }
    }

    if (isSaveSuccess) {
      try {
        await this.groupService.updateGroupScanDate(groupVKId, new Date());
        this.logger.log(`дата сканирования группы ${groupVKId} обновлена`);
      } catch (error) {
        this.logger.error(
          `ошибка обновления даты сканирования группы ${groupVKId}`,
        );
      }
    }

    return params;
  }

  async getPostList({
    access_token,
    owner_id,
    extended = 0,
    count = 30, // NOTE count - количество получаемых постов за один запрос
    offset = 0,
  }: {
    access_token: string;
    owner_id: number;
    extended?: number;
    count?: number;
    offset?: number;
  }) {
    const params = {
      owner_id: -owner_id,
      client_id: this.configService.get('vk.appId'),
      v: VK_API.version,
      extended,
      access_token,
      count,
      offset,
    };
    const response = await this.httpService.axiosRef.post<VKWallType>(
      `${VK_API.path}/wall.get`,
      qs.stringify(params),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    if (response.data.hasOwnProperty('error')) {
      const error = response.data as unknown as VKResponseApiErrorType;
      throw new VK_API_Error(error.error.error_msg);
    }
    return {
      count,
      offset,
      data: response.data,
    };
  }

  async savePostList(
    groupVKId: number,
    postParamsList: {
      post_vkid: number;
      likes: number;
      views: number;
      comments: number;
      timestamp_post: number;
      json: object;
    }[],
  ) {
    const group = await this.groupService.findOne(groupVKId);
    const postList = await this.postService.createOrUpdatePostList(
      group,
      postParamsList,
    );
    if (!postList) {
      throw new DatabaseServiceError(
        'func: savePostList. Ошибка сохранения постов',
      );
    }
    return postList;
  }

  private calcLimitTimestamp(scanDaysDepth: number): number {
    const limitDate = new Date();
    limitDate.setHours(23, 59, 0, 0);
    limitDate.setDate(limitDate.getDate() - scanDaysDepth);

    return limitDate.getTime();
  }
}
