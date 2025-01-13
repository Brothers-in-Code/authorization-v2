import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { ScanApiService } from './scan-api.service';
import { AuthService } from 'src/modules/auth/services/auth.service';

import { ResponseInfoType } from 'src/types/api-response-type';
import { GetAccessTokenDto } from './dto/get-access-token.dto';

import { VK_AUTH_Error } from 'src/errors/vk-errors';
import { DatabaseServiceError } from 'src/errors/service-errors';
import { PostParamsListDto } from './dto/post-params-list.dto';
import { ApiInternalGuard } from 'src/shared/guards/api-internal/api-internal.guard';

@UseGuards(ApiInternalGuard)
@Controller('api/scan')
export class ScanApiController {
  constructor(private readonly scanApiService: ScanApiService) {}

  private readonly logger = new Logger(ScanApiController.name);

  @Get('data')
  async getDataScan() {
    try {
      const queryResultList = await this.scanApiService.dataScanQuery();
      return { data: queryResultList };
    } catch (error) {
      throw new HttpException(
        `ошибка получения данных для сканирования! ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      throw new HttpException(
        `ошибка сохранения постов! ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
