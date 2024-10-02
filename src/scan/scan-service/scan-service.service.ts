import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { log } from 'console';
import { AuthService } from 'src/auth/services/auth.service';
import { VkDataService } from 'src/vk-data/services/vkdata.service';
import { DataSource } from 'typeorm';

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
  ) {}
  private readonly logger = new Logger(ScanService.name);

  @Cron('0 12 * * *')
  async run() {
    console.log('scan service start');

    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
      log('Data Source has been initialized!');
    }
    const limitDate = this.calcLimitDate();

    const queryResultList = await this.executeQuery();
    if (queryResultList) {
      for (const queryResult of queryResultList) {
        this.logger.log('queryResult', queryResult);
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

  async scanGroupList(
    access_token: string,
    groupIdList: number[],
    limitDate: Date,
  ) {
    for (const groupId of groupIdList) {
      try {
        const response = await this.vkDataService.getWallPrivetGroup({
          access_token,
          owner_id: groupId,
          extended: 1,
        });
      } catch (error) {
        this.logger.error(error);
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
    this.logger.log(`saving user`);
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
[
  {
    userVkId: 1267318,
    access_token:
      'vk2.a.4rlp1h7R_gUm8KHGntp92Ai4DoC6YLV353zw5Eq6j0PoWmawJKEuu3fj0JC3hcO6tX0Hefu4YbkzfEqV67rwuVUgiwJSGo0pqstPDk7IF7iutRhizaY36yG3_08QlzG3dUL5IoVFRqAa4buG0LmfV26DVJRKjbkXGK3aOlZVgqMNGFSRJZHTY7JMOAyjOV8M5xXclUsllI_l0xq-zN4b4pRSTXyUQG9LjJt1inurLIXO_KFwwysqIfiFvsSAkbgE',
    groupVkIdList: [
      157411113, 194722794, 194548696, 183845132, 181923456, 179726290,
      178555683, 174313131, 174175575, 165655866, 164521091, 161210648,
      198042875, 157234982, 153091152, 149991234, 138866927, 119887842,
      103444168, 102708953, 100356170, 93479367, 85093379, 82867919, 212994058,
      225911196, 225730539, 224942913, 222360594, 220330144, 218587147,
      218009387, 217748033, 216095736, 215410459, 213136015, 70369416,
      212880886, 212827933, 212203269, 212119662, 211402835, 211332957,
      210262775, 205182240, 203875097, 200079914, 64406181, 365, 486, 174093,
      220768, 265492, 3188704, 4693353, 4784251, 5639392, 5868563, 6113019,
      7540224, 11073348, 14403612, 11737413, 61427000, 51837938, 42967112,
      36723693, 31393841, 31036611, 29604206, 22098901, 20056116, 19098821,
    ],
    refresh_token:
      'vk2.a.MxHHUuWciOr-TqrhUvnRgv1JnQIuH8lrl9G3Ayt1bb84PrzeXZPcI7hOBXKAUoZDnJ5pfX69moUgr7Gg21HaQm9cmgUyPHPzyCaRHlGeujclxlDXbp6WQjj8mZ36_A9mXDr80x2TdPqP-sT5cTw_il5qCvvV0Ebac3jAjudPVFyzbem1psJQUzfP2XbjUozn9fr4BEfd38dTIUNYLYqqGtSNHKi3uJCqNcFZzmL-z9Q',
  },
  {
    userVkId: 1267322,
    access_token:
      'vk2.a.IM5iAqpe8b5tmEEpYnH58pjt2OLYFlCuQPY2cGU_NGpRsZBGIT2yGsg1YGtWXjr0FjFpF10GWVAp615Xv9Xw9IDSHftqliMSKQ_ggHPnsWEQ-2f9x4fSP-5qOQJG6jOGgBt7gvyYasN2UgyBzVnwDAGzz2rkX2oQbIXNxKzky5qfnJxS0WrGf-oCGpo5zCRTI2OJISBPCu1Pkcrg7LgZvEOdNGS92odkSxXOiRkMlVEKItdFDbOJYgMqfSw3PgxZ',
    groupVkIdList: [116, 115, 114, 113, 112, 111, 110, 109, 108],
    refresh_token:
      'vk2.a.roVa7F4u-Xr3Znw8mH3q6-hSSTe3kHp5D7FLr3w_p6O0K_Ud7z-uBNfCf4xjcPOZjAlQANJBQqCmGTnwnqJFofRHe4OVVJxgKy1yfqasAD1GtlX5WvynllVxXU2JTr-Ndy8x5uPSrr9prK1JuGiooAdBiY0doBXD1ce_FyOgYeFQNWkxnvbNKE3W0YmDxjxSu4GGBg9W6qT8fR5dZQBv_DoNkXFx95F3qJGyyUbursU',
  },
  {
    userVkId: 1267320,
    access_token:
      'vk2.a.IM5iAqpe8b5tmEEpYnH58pjt2OLYFlCuQPY2cGU_NGpRsZBGIT2yGsg1YGtWXjr0FjFpF10GWVAp615Xv9Xw9IDSHftqliMSKQ_ggHPnsWEQ-2f9x4fSP-5qOQJG6jOGgBt7gvyYasN2UgyBzVnwDAGzz2rkX2oQbIXNxKzky5qfnJxS0WrGf-oCGpo5zCRTI2OJISBPCu1Pkcrg7LgZvEOdNGS92odkSxXOiRkMlVEKItdFDbOJYgMqfSw3PgxZ',
    groupVkIdList: [102, 104, 105, 106, 107, 100],
    refresh_token:
      'vk2.a.roVa7F4u-Xr3Znw8mH3q6-hSSTe3kHp5D7FLr3w_p6O0K_Ud7z-uBNfCf4xjcPOZjAlQANJBQqCmGTnwnqJFofRHe4OVVJxgKy1yfqasAD1GtlX5WvynllVxXU2JTr-Ndy8x5uPSrr9prK1JuGiooAdBiY0doBXD1ce_FyOgYeFQNWkxnvbNKE3W0YmDxjxSu4GGBg9W6qT8fR5dZQBv_DoNkXFx95F3qJGyyUbursU',
  },
  {
    userVkId: 1267324,
    access_token:
      'vk2.a.IM5iAqpe8b5tmEEpYnH58pjt2OLYFlCuQPY2cGU_NGpRsZBGIT2yGsg1YGtWXjr0FjFpF10GWVAp615Xv9Xw9IDSHftqliMSKQ_ggHPnsWEQ-2f9x4fSP-5qOQJG6jOGgBt7gvyYasN2UgyBzVnwDAGzz2rkX2oQbIXNxKzky5qfnJxS0WrGf-oCGpo5zCRTI2OJISBPCu1Pkcrg7LgZvEOdNGS92odkSxXOiRkMlVEKItdFDbOJYgMqfSw3PgxZ',
    groupVkIdList: [118, 119, 120],
    refresh_token:
      'vk2.a.roVa7F4u-Xr3Znw8mH3q6-hSSTe3kHp5D7FLr3w_p6O0K_Ud7z-uBNfCf4xjcPOZjAlQANJBQqCmGTnwnqJFofRHe4OVVJxgKy1yfqasAD1GtlX5WvynllVxXU2JTr-Ndy8x5uPSrr9prK1JuGiooAdBiY0doBXD1ce_FyOgYeFQNWkxnvbNKE3W0YmDxjxSu4GGBg9W6qT8fR5dZQBv_DoNkXFx95F3qJGyyUbursU',
  },
  {
    userVkId: 1267326,
    access_token:
      'vk2.a.IM5iAqpe8b5tmEEpYnH58pjt2OLYFlCuQPY2cGU_NGpRsZBGIT2yGsg1YGtWXjr0FjFpF10GWVAp615Xv9Xw9IDSHftqliMSKQ_ggHPnsWEQ-2f9x4fSP-5qOQJG6jOGgBt7gvyYasN2UgyBzVnwDAGzz2rkX2oQbIXNxKzky5qfnJxS0WrGf-oCGpo5zCRTI2OJISBPCu1Pkcrg7LgZvEOdNGS92odkSxXOiRkMlVEKItdFDbOJYgMqfSw3PgxZ',
    groupVkIdList: [122, 123],
    refresh_token:
      'vk2.a.roVa7F4u-Xr3Znw8mH3q6-hSSTe3kHp5D7FLr3w_p6O0K_Ud7z-uBNfCf4xjcPOZjAlQANJBQqCmGTnwnqJFofRHe4OVVJxgKy1yfqasAD1GtlX5WvynllVxXU2JTr-Ndy8x5uPSrr9prK1JuGiooAdBiY0doBXD1ce_FyOgYeFQNWkxnvbNKE3W0YmDxjxSu4GGBg9W6qT8fR5dZQBv_DoNkXFx95F3qJGyyUbursU',
  },
];
