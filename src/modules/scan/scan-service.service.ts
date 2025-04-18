import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';

import * as qs from 'qs'; // NOTE для будущего нового vkDataService

import { HttpService } from '@nestjs/axios'; // NOTE для будущего нового vkDataService
import { GroupService } from 'src/db/services/group.service';

import { VK_API_Error } from 'src/errors/vk-errors';

import { PostType, VKWallType } from 'src/types/vk-wall-type';
import { VKResponseApiErrorType } from 'src/types/vk-error-type';
import {
  ResponseInfoType,
  SuccessResponseType,
} from 'src/types/api-response-type';

type ExecuteQueryOutputType = {
  userVkId: number;
  access_token: string;
  refresh_token: string;
  groupVkIdList: number[];
  device_id: string;
};

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
export class ScanService implements OnModuleInit {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private configService: ConfigService,
    private groupService: GroupService,
    private schedulerRegistry: SchedulerRegistry,
    private httpService: HttpService, // NOTE для будущего нового vkDataService
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

    const queryResultList = await this.getDataForScanning();

    if (queryResultList) {
      for (const queryResult of queryResultList) {
        const tokenResult = await this.getNewAccessToken(queryResult.userVkId);

        if (tokenResult) {
          this.logger.log('получен новый access_token');
        } else {
          //  todo добавить группы этого пользователя в список групп следующего пользователя
          continue;
        }

        const scanGroupListResult = await this.scanGroupList(
          tokenResult.data.access_token,
          queryResult.groupVkIdList,
          limitTimestamp,
        );
        this.logger.log(
          `======== Сканирование групп завершено. ${scanGroupListResult} ========`,
        );
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
      let currentPostTimestamp = this.getStartTimestamp(new Date().getTime());
      let isSaveSuccess = false;

      while (currentPostTimestamp >= limitTimestamp) {
        let responsePostList: ResponsePostListType;

        try {
          responsePostList = await this.getWallPrivetGroup({
            access_token,
            owner_id: groupVKId,
            extended: 0,
            count: COUNT,
            offset: currentOffset,
          });
          const { offset, data } = responsePostList;
          const postList = data?.response?.items;

          this.logger.log(`получены посты группы groupVKId = ${groupVKId}`);

          if (!postList || postList.length === 0) {
            this.logger.log(`Нет постов у группы groupVKId = ${groupVKId}`);
            break;
          }

          const filteredPostList = postList.filter(
            (item) => item.date * 1000 >= limitTimestamp,
          );

          if (filteredPostList.length === 0) {
            this.logger.log(
              `Нет новых постов у группы groupVKId = ${groupVKId}`,
            );
            break;
          }

          const postResponse = await this.savePostList(
            groupVKId,
            filteredPostList,
          );

          if (postResponse) {
            this.logger.log(
              `посты группы groupVKId = ${groupVKId} сохранены. offset = ${currentOffset}`,
            );
            isSaveSuccess = true;
          }

          currentOffset = offset + COUNT;
          currentPostTimestamp = postList[postList.length - 1].date * 1000;
        } catch (error) {
          if (error.response && error.response.data) {
            this.logger.error(error.response.data);
          }
          if (error.response && error.response.status === 413) {
            errorsCounter++;
            this.logger.error(error);

            await this.retrySaveLargePostList(
              groupVKId,
              responsePostList.data.response.items,
            );
            break;
          } else {
            errorsCounter++;
            this.logger.error(
              `ошибка ПОЛУЧЕНИЯ или СОХРАНЕНИЯ постов группы ${groupVKId}: ${error}`,
            );
            break;
          }
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
    }
    return `группы отсканированы. Количество ошибок: ${errorsCounter}`;
  }

  //    NOTE будущий независимый vkDataService
  private readonly apiInternalSecret = this.configService.get<string>(
    'app.apiInternalSecret',
  );

  private readonly VK_API = 'https://api.vk.com/method';
  private readonly VK_API_VERSION = 5.199;
  private readonly HOST = this.configService.get('app.host');
  private readonly PROTOCOL = this.configService.get('app.protocol');
  private readonly SCAN_API = `${this.PROTOCOL}://${this.HOST}/api/scan/`;
  // private readonly SCAN_API = `${this.PROTOCOL}://localhost:3000/api/scan/`;
  private readonly AUTH_API = `${this.PROTOCOL}://${this.HOST}/api/auth/`;

  async getNewAccessToken(
    userVkId: number,
  ): Promise<null | SuccessResponseType<any>> {
    try {
      const response = await this.httpService.axiosRef.post<
        SuccessResponseType<any>
      >(
        `${this.AUTH_API}refresh-token`,
        {
          user_vkid: userVkId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiInternalSecret}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `ошибка получения access_token! userVkId: ${userVkId}; ${error}`,
      );
      if (error.response && error.response.data) {
        this.logger.warn('детали ошибки:');
        this.logger.log(error.response.data);
      }

      return null;
    }
  }

  async getDataForScanning() {
    try {
      const response = await this.httpService.axiosRef.get<{ data: string }>(
        `${this.SCAN_API}data`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiInternalSecret}`,
          },
        },
      );
      // TODO сделать валидацию полученных данных
      const parsedData = (await JSON.parse(
        response.data.data,
      )) as ExecuteQueryOutputType[];
      return parsedData;
    } catch (error) {
      this.logger.error(error);
      throw new Error(`ошибка получения данных для сканирования! ${error}`);
    }
  }

  async getWallPrivetGroup({
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
      v: this.VK_API_VERSION,
      extended,
      access_token,
      count,
      offset,
    };
    const response = await this.httpService.axiosRef.post<VKWallType>(
      `${this.VK_API}/wall.get`,
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

  async retrySaveLargePostList(
    groupVKId: number,
    itemList: PostType[],
    attempt = 1,
    maxAttempts = 4,
  ) {
    const MIN_ITEM_COUNT = 6;

    this.logger.warn(
      `func: retrySaveLargePostList. попытка ${attempt} сохранения постов группы ${groupVKId}`,
    );
    if (attempt > maxAttempts) {
      throw new Error(
        `Превышено максимальное количество попыток сохранения постов группы ${groupVKId}`,
      );
    }

    if (itemList.length < MIN_ITEM_COUNT) {
      throw new Error(
        `Длина массива меньше допустимой ${MIN_ITEM_COUNT} для сохранения постов группы ${groupVKId}`,
      );
    }

    const splittedItemList = this.splitPostList(itemList);
    let itemIndex = 0;
    for (const item of splittedItemList) {
      itemIndex++;
      try {
        const postResponse = await this.savePostList(groupVKId, item);

        if (postResponse) {
          this.logger.log(
            `посты группы groupVKId = ${groupVKId} сохранены. attempt: ${attempt}, itemIndex: ${itemIndex} count: ${
              item.length * itemIndex
            }`,
          );
        }
      } catch (error) {
        if (error.response.status === 413) {
          await this.retrySaveLargePostList(groupVKId, item, attempt + 1, 5);
        } else {
          this.logger.warn(error);
        }
      }
    }
  }

  private async savePostList(groupVKId: number, itemList: PostType[]) {
    const postParamsList = itemList.map((item) => {
      return {
        post_vkid: item.id,
        likes: item.likes?.count || 0,
        views: item.views?.count || 0,
        comments: item.comments.count || 0,
        timestamp_post: item.date,
        json: item,
      };
    });

    const response = await this.httpService.axiosRef
      .post<ResponseInfoType>(
        `${this.SCAN_API}posts`,
        {
          groupVKId,
          postParamsList,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiInternalSecret}`,
          },
        },
      )
      .then((response) => {
        return response;
      })
      .catch((error) => {
        this.logger.error(error);
        throw error;
      });
    return response;
  }

  private calcLimitTimestamp(): number {
    const scanDaysDepth = this.configService.get('app.scanDaysDepth');
    const limitDate = new Date();
    limitDate.setHours(0, 0, 0, 0);
    limitDate.setDate(limitDate.getDate() - scanDaysDepth);

    return limitDate.getTime();
  }

  private getStartTimestamp(timestamp: number): number {
    const localDate = new Date(timestamp);
    localDate.setHours(23, 59, 0, 0);
    return localDate.getTime();
  }

  private splitPostList(itemList: PostType[]) {
    const middle = Math.ceil(itemList.length / 2);
    return [itemList.slice(0, middle), itemList.slice(middle)];
  }
}
