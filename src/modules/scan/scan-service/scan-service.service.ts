import {
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CronJob } from 'cron';

import { AuthService } from 'src/modules/auth/services/auth.service';
import { GroupService } from 'src/db/services/group.service';
import { VkDataService } from 'src/modules/vk-data/services/vkdata.service';
import { VK_API_Error, VK_AUTH_Error } from 'src/errors/vk-errors';
import {
  DatabaseServiceError,
  RegularServiceError,
} from 'src/errors/service-errors';

type ExecuteQueryOutputType = {
  userVkId: number;
  access_token: string;
  refresh_token: string;
  groupVkIdList: number[];
  device_id: string;
};

@Injectable()
export class ScanService implements OnModuleInit {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private configService: ConfigService,
    private authService: AuthService,
    private vkDataService: VkDataService,
    private groupService: GroupService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  private readonly logger = new Logger(ScanService.name);

  onModuleInit(): void {
    const config = this.configService.getOrThrow('cron');
    if (!config.enabled) {
      this.logger.log('Scan was not enabled');
      return;
    }
    this.logger.log(`Scan was enabled at ${config.schedule})`);

    const job = new CronJob(config.schedule, async () => {
      this.logger.log('Scan was run');
      await this.run();
    });

    this.schedulerRegistry.addCronJob('scan-groups', job);
    job.start();
  }

  async run() {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
      this.logger.log('Data Source has been initialized!');
    }
    const limitTimestamp = this.calcLimitTimestamp();

    const queryResultList = await this.executeQuery();
    if (queryResultList) {
      for (const queryResult of queryResultList) {
        const tokenResult = await this.getNewAccessToken(
          queryResult.refresh_token,
          queryResult.device_id,
        );
        this.logger.log('получен новый access_token');

        await this.saveUser(
          queryResult.userVkId,
          tokenResult.access_token,
          tokenResult.refresh_token,
          queryResult.device_id,
          tokenResult.expires_in,
        );
        this.logger.log(
          `Сохранение пользователя завершено. userVkId = ${queryResult.userVkId}`,
        );

        const scanGroupListResult = await this.scanGroupList(
          tokenResult.access_token,
          queryResult.groupVkIdList,
          limitTimestamp,
        );
        this.logger.log(`Сканирование групп завершено. ${scanGroupListResult}`);
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
    limitTimestamp: number,
  ) {
    const COUNT = 30;
    let errorsCounter = 0;

    for (const groupVKId of groupVKIdList) {
      let currentOffset = 0;
      let currentPostTimestamp = new Date().getTime();

      while (currentPostTimestamp >= limitTimestamp) {
        try {
          const response = await this.vkDataService.getWallPrivetGroup({
            access_token,
            owner_id: groupVKId,
            extended: 0,
            count: COUNT,
            offset: currentOffset,
          });
          const { offset, data } = response;
          if (data.response.items && data.response.items.length > 0) {
            const group = await this.groupService.findOne(groupVKId);

            const postParamsList = data.response.items.map((item) => {
              return {
                post_vkid: item.id,
                likes: item.likes?.count || 0,
                views: item.views?.count || 0,
                comments: item.comments.count || 0,
                timestamp_post: item.date,
                json: JSON.stringify(item),
              };
            });

            await this.vkDataService.savePostList(group, postParamsList);
            this.logger.log(
              `посты группы groupVKId = ${groupVKId} сохранены. offset = ${currentOffset}`,
            );

            currentOffset = offset + COUNT;
            currentPostTimestamp =
              postParamsList[postParamsList.length - 1].timestamp_post * 1000;
          } else {
            errorsCounter++;
            this.logger.error(
              `у группы ${groupVKId} нет постов или закрыта стена`,
            );
            break;
          }
        } catch (error) {
          if (error instanceof VK_API_Error) {
            errorsCounter++;
            this.logger.error(
              `ошибка ПОЛУЧЕНИЯ постов группы ${groupVKId}: ${error.message}`,
            );
            break;
          } else if (error instanceof RegularServiceError) {
            errorsCounter++;
            this.logger.error(
              `ошибка ПОЛУЧЕНИЯ постов группы ${groupVKId}: ${error.message}`,
            );
            break;
          } else if (error instanceof UnauthorizedException) {
            errorsCounter++;
            this.logger.error(
              `ошибка СОХРАНЕНИЯ постов группы ${groupVKId}: ${error.message}`,
            );
            break;
          } else if (error instanceof DatabaseServiceError) {
            errorsCounter++;
            this.logger.error(
              `ошибка СОХРАНЕНИЯ постов группы ${groupVKId}: ${error.message}`,
            );
            break;
          } else {
            errorsCounter++;
            this.logger.error(
              `неизвестная ошибка ПОЛУЧЕНИЯ или СОХРАНЕНИЯ постов группы ${groupVKId}: ${error.message}`,
            );
            break;
          }
        }
      }

      try {
        await this.groupService.updateGroupScanDate(groupVKId, new Date());
        this.logger.log(`дата сканирования группы ${groupVKId} обновлена`);
      } catch (error) {
        this.logger.error(
          `ошибка обновления даты сканирования группы ${groupVKId}`,
        );
      }
    }
    return `группы отсканированы. Количество ошибок: ${errorsCounter}`;
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
      return response;
    } catch (error) {
      if (error instanceof VK_AUTH_Error) {
        this.logger.error(`ошибка получения access_token! ${error.message}`);
        return null;
      } else if (error instanceof UnauthorizedException) {
        this.logger.error(`ошибка получения access_token! ${error.message}`);
        return null;
      } else {
        this.logger.error(
          `неизвестная ошибка получения access_token! ${error.message}`,
        );
        throw new Error(
          `неизвестная ошибка получения access_token! ${JSON.stringify(
            error.message,
          )}`,
        );
      }
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
  //  1731013483350
  //  1730408683350
  //    1730260199
  calcLimitTimestamp(): number {
    const scanDaysDepth = this.configService.get('app.scanDaysDepth');
    const limitDate = new Date();
    limitDate.setHours(23, 59, 0, 0);
    limitDate.setDate(limitDate.getDate() - scanDaysDepth);

    return limitDate.getTime();
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
        `func: executeQuery. Ошибка выполнения запроса к БД: ${JSON.stringify({
          result,
        })}`,
      );
      throw new Error('func: executeQuery. Ошибка выполнения запроса к БД');
    }

    return result[0]['result'];
  }
}
