import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AuthService } from 'src/auth/services/auth.service';
import { GroupService } from 'src/db/services/group.service';
import { VkDataService } from 'src/vk-data/services/vkdata.service';

type ExecuteQueryOutputType = {
  userVkId: number;
  access_token: string;
  refresh_token: string;
  groupVkIdList: number[];
  device_id: string;
};

@Injectable()
export class ScanService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private configService: ConfigService,
    private authService: AuthService,
    private vkDataService: VkDataService,
    private groupService: GroupService,
  ) {}
  private readonly logger = new Logger(ScanService.name);

  @Cron('0 12 * * *')
  async run() {
    this.logger.log('scan service start');

    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
      this.logger.log('Data Source has been initialized!');
    }
    const limitDate = this.calcLimitDate();

    const queryResultList = await this.executeQuery();
    if (queryResultList) {
      for (const queryResult of queryResultList) {
        const tokenResult = await this.getNewAccessToken(
          queryResult.refresh_token,
          queryResult.device_id,
        );

        if (tokenResult) {
          await this.saveUser(
            queryResult.userVkId,
            tokenResult.access_token,
            tokenResult.refresh_token,
            queryResult.device_id,
            tokenResult.expires_in,
          );

          await this.scanGroupList(
            tokenResult.access_token,
            queryResult.groupVkIdList,
            limitDate,
          );
        }
      }
    }
  }

  /*
   TODO 
   использовать execute 
   https://dev.vk.com/ru/method/execute
   (должно подойти для получения постов за определенный промежуток времени)
   */

  async scanGroupList(
    access_token: string,
    groupVKIdList: number[],
    limitDate: Date,
  ) {
    for (const groupVKId of groupVKIdList) {
      try {
        const response = await this.vkDataService.getWallPrivetGroup({
          access_token,
          owner_id: groupVKId,
          extended: 0,
        });
        if (response && response.response.items) {
          const group = await this.groupService.findOne(groupVKId);

          const postParamsList = response.response.items.map((item) => {
            return {
              post_vkid: item.id,
              json: JSON.stringify(item),
            };
          });

          const postList = await this.vkDataService.savePostList(
            group,
            postParamsList,
          );
          if (postList) {
            await this.groupService.updateGroupScanDate(groupVKId, limitDate);
          }
        } else {
          this.logger.error(`у группы ${groupVKId} нет постов`);
        }
      } catch (error) {
        this.logger.error(
          `ошибка получения постов группы ${groupVKId}: ${error}`,
          error,
        );
      }
    }
  }

  async getNewAccessToken(
    refresh_token: string,
    device_id: string,
  ): Promise<null | {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    try {
      const response = await this.authService.refreshAccessToken(
        refresh_token,
        device_id,
      );
      if (!response.hasOwnProperty('access_token')) {
        this.logger.error(
          `ошибка получения access_token через refresh_token: ${response}`,
        );
        return null;
      }
      return response;
    } catch (error) {
      this.logger.error(
        `ошибка получения access_token через refresh_token: ${error}`,
      );
      return null;
    }
  }

  async saveUser(
    user_id: number,
    access_token: string,
    refresh_token: string,
    device_id: string,
    expires_in: number,
  ) {
    const expires_date = this.authService.calcExpiresDate(expires_in);
    const user = await this.authService.saveUser(
      user_id,
      access_token,
      refresh_token,
      device_id,
      expires_date,
    );
    if (user) {
      this.logger.log(`user ${user_id} saved`);
    } else {
      this.logger.error(`user ${user_id} not saved`);
    }
  }

  calcLimitDate(): Date {
    const scanDaysDepth = this.configService.get('app.scanDaysDepth');
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - scanDaysDepth);
    return limitDate;
  }

  async executeQuery(): Promise<ExecuteQueryOutputType[]> {
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
        JOIN \`group\` g ON
            ug.group_id = g.id
          WHERE u.deleted_at is NULL AND g.deleted_at is NULL
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

    return result[0]['result'];
  }
}
