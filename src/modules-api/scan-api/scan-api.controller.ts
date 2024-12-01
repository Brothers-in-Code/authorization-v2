import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { ScanApiService } from './scan-api.service';
import { AuthService } from 'src/modules/auth/services/auth.service';

import { ResponseInfoType } from 'src/types/api-response-type';
import { GetAccessTokenDto } from './dto/get-access-token.dto';

import { VK_AUTH_Error } from 'src/errors/vk-errors';
import { DatabaseServiceError } from 'src/errors/service-errors';
import { PostParamsListDto } from './dto/post-params-list.dto';

@Controller('api/scan')
export class ScanApiController {
  constructor(
    private readonly scanApiService: ScanApiService,
    private readonly authService: AuthService,
  ) {}

  private readonly logger = new Logger(ScanApiController.name);

  @Get('data')
  async getDataScan() {
    const queryResultList = await this.scanApiService.dataScanQuery();
    return { data: queryResultList };
  }

  /**
   * @description Получение нового access_token
   * @function getAccessToken
   * @param body
   *  refresh_token: string;
   *  device_id: string;
   */
  @Post('access-token')
  async getAccessToken(
    @Body()
    body: GetAccessTokenDto, //
  ): Promise<{
    data: { access_token: string };
    success: ResponseInfoType;
  }> {
    try {
      const response = await this.authService.refreshAccessToken(
        body.refresh_token,
        body.device_id,
      );

      await this.scanApiService.saveUser(
        body.user_vkid,
        response.access_token,
        response.refresh_token,
        body.device_id,
        response.expires_in,
      );

      return {
        data: { access_token: response.access_token },
        success: {
          status: HttpStatus.OK,
          message: 'access_token получен',
          code: 'success',
        },
      };
    } catch (error) {
      if (error instanceof VK_AUTH_Error) {
        throw new HttpException(
          {
            error: {
              status: HttpStatus.BAD_REQUEST,
              message: `ошибка получения access_token! ${error.message}`,
              code: 'vk_auth_error',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      } else if (error instanceof UnauthorizedException) {
        throw new HttpException(
          {
            error: {
              status: HttpStatus.UNAUTHORIZED,
              message: `ошибка получения access_token! ${error.message}`,
              code: 'unauthorized',
            },
          },
          HttpStatus.UNAUTHORIZED,
        );
      } else if (error instanceof DatabaseServiceError) {
        throw new HttpException(
          {
            error: {
              status: HttpStatus.BAD_REQUEST,
              message: `ошибка сохранения user ${error.message}`,
              code: 'internal_error',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          {
            error: {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              message: `неизвестная ошибка получения access_token! ${error.message}`,
              code: 'internal_error',
            },
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * @description Сохранение постов
   * @function savePostList
   * @param body
   * @property post_vkid: number
   * @property likes:  number
   * @property views:  number
   * @property comments:  number
   * @property timestamp_post:  number
   * @property json:  string
   */
  @Post('posts')
  async savePostList(
    @Body()
    body: PostParamsListDto,
  ): Promise<{ success: ResponseInfoType }> {
    const { groupVKId, postParamsList } = body;
    try {
      await this.scanApiService.savePostList(groupVKId, postParamsList);
      return {
        success: {
          status: HttpStatus.OK,
          message: 'посты сохранены',
          code: 'success',
        },
      };
    } catch (error) {
      if (error instanceof DatabaseServiceError) {
        throw new HttpException(
          {
            error: {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              message: error.message,
              code: 'internal_error',
            },
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          {
            error: {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              message: `неизвестная ошибка сохранения постов! ${error.message}`,
              code: 'internal_error',
            },
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
