import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { GroupService } from 'src/db/services/group.service';
import { PostService } from 'src/db/services/post.service';
import { DatabaseServiceError } from 'src/errors/service-errors';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { DataSource } from 'typeorm';

type ExecuteQueryOutputType = {
  userVkId: number;
  access_token: string;
  refresh_token: string;
  groupVkIdList: number[];
  device_id: string;
};

@Injectable()
export class ScanApiService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly authService: AuthService,
    private postService: PostService,
    private groupService: GroupService,
  ) {}

  private readonly logger = new Logger(ScanApiService.name);

  // todo скорее всего можно удалить - проверить использование в scan-api.controller.getAccessToken
  async saveUser(
    user_id: number,
    access_token: string,
    refresh_token: string,
    device_id: string,
    expires_in: number,
  ) {
    const expires_date = this.authService.calcExpiresDate(expires_in);
    try {
      await this.authService.saveUser(
        user_id,
        access_token,
        refresh_token,
        device_id,
        expires_date,
      );
      return `user ${user_id} saved`;
    } catch (error) {
      if (error instanceof DatabaseServiceError) {
        this.logger.error(`ошибка сохранения user ${error.message}`);
      } else {
        this.logger.error(
          `неизвестная ошибка сохранения user ${user_id}! ${error.message}`,
        );
        throw new Error(
          `неизвестная ошибка сохранения user ${user_id}! ${JSON.stringify(
            error.message,
          )}`,
        );
      }
    }
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

  async dataScanQuery(): Promise<ExecuteQueryOutputType[]> {
    const query = `
            WITH cte AS (
            SELECT
                COUNT(ug.user_id) OVER (PARTITION BY ug.user_id) AS count_user,
                ROW_NUMBER() OVER (PARTITION BY g.vkid ORDER BY ug.id) AS count_group,
                ug.id,
                u.user_vkid AS user_vkid,
                g.vkid AS group_vkid,
                u.access_token,
                u.refresh_token,
                u.device_id
            FROM
                user_group ug
            JOIN user u ON
                ug.user_id = u.id
            JOIN vk_group g ON
                ug.group_id = g.id
              WHERE u.deleted_at is NULL AND g.deleted_at is NULL and ug.is_scan = 1
            )
            SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT(
                'userVkId', user_vkid,
                'groupVkIdList', group_vkid_list,
                'access_token', access_token, 
                'refresh_token', refresh_token,
                'device_id', device_id
                )
            ) AS result
            FROM (
            SELECT
                user_vkid,
                JSON_ARRAYAGG(group_vkid) AS group_vkid_list,
                access_token,
                refresh_token,
                device_id,
                count_user
            FROM
                cte
            WHERE
                count_group = 1
            GROUP BY
                user_vkid, access_token, refresh_token, count_user
            ORDER BY
                count_user DESC
            ) AS grouped;
        `;
    const result = await this.dataSource.query(query);

    if (!result[0]['result']) {
      this.logger.error(
        `func: executeQuery. Ошибка выполнения запроса к БД: ${result[0]['message']}`,
      );
      throw new Error('func: executeQuery. Ошибка выполнения запроса к БД');
    }

    return result[0]['result'];
  }
}
