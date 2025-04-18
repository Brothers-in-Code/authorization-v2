import {
  UnauthorizedException,
  InternalServerErrorException,
  Body,
  Controller,
  Get,
  Post,
  Res,
  Logger,
  Req,
  Query,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

import { UserService } from 'src/db/services/user.service';
import { UserSubscriptionService } from 'src/db/services/user-subscription.service';
import { AuthService } from './services/auth.service';

import { encrypt, decrypt } from 'src/utils/crypting';
import {
  ErrorResponseType,
  SuccessResponseType,
} from 'src/types/api-response-type';
import { ApiInternalGuard } from 'src/shared/guards/api-internal/api-internal.guard';

type VerificationOutputType = {
  client_id: number;
  redirect_uri: string;
  response_type: string;
  code_verifier: string;
  code_challenge: string;
  code_challenge_method: string;
  state: string;
  scope: string;
  display: string;
};

type AuthBaseOutputType = {
  message: string;
  status: string;
  redirectTo?: string;
  error?: any;
};

const cookieOptions = {
  httpOnly: false,
  secure: true,
  samesite: 'strict',
};

@Controller('api/auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private userService: UserService,
    private userSubscriptionService: UserSubscriptionService,
  ) {}

  private readonly logger = new Logger(AuthController.name);

  @Get('verification')
  verification(
    @Query('redirectTo') redirectTo = 'work-space/groups',
    @Res({ passthrough: true }) res: Response,
  ): VerificationOutputType {
    const encryptKey = this.configService.get('app.encryptKey');
    const verificationState = this.authService.createVerificationState();
    const hashCodeVerifier = encrypt(
      verificationState.code_verifier,
      encryptKey,
    );

    res.cookie('state', verificationState.state, cookieOptions);
    res.cookie('code_verifier', hashCodeVerifier, cookieOptions);
    res.cookie('redirectTo', redirectTo, cookieOptions);

    return verificationState;
  }

  @Post('get-token')
  async handleGetToken(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
    @Body()
    {
      code,
      state,
      device_id,
    }: {
      code: string;
      state: string;
      device_id: string;
    },
  ): Promise<AuthBaseOutputType> {
    const encryptKey = this.configService.get('app.encryptKey');
    const cookieState = req.cookies?.state || null;
    const hashCodeVerifier = req.cookies?.code_verifier || null;
    const redirectTo = req.cookies?.redirectTo || null;

    if (!cookieState || !hashCodeVerifier) {
      throw new UnauthorizedException(
        `There is no state (${cookieState}) or code_verifier (${hashCodeVerifier}) in cookies`,
      );
    }
    const codeVerifier = decrypt(hashCodeVerifier, encryptKey);
    const isStateVerified = this.authService.verifyState(state, cookieState);

    if (!isStateVerified) {
      throw new UnauthorizedException('state did not through verification');
    }

    try {
      const response = await this.authService.getAccessToken(
        code,
        device_id,
        codeVerifier,
      );

      if (!response.hasOwnProperty('access_token')) {
        return {
          message: 'Token not received',
          status: 'error',
          error: response,
        };
      }

      const userInfo = await this.authService.getUserInfo(
        response.access_token,
      );

      const expires_date = this.authService.calcUserTokenExpiresDate(
        response.expires_in,
      );

      const user = await this.authService.saveUser(
        response.user_id,
        response.access_token,
        response.refresh_token,
        response.device_id,
        expires_date,
      );

      const userToken = await this.authService.createJWTToken(user.id, {
        name: userInfo.user.first_name,
        avatar: userInfo.user.avatar,
      });
      res.cookie('user_token', userToken, cookieOptions);

      const userSubscription =
        await this.userSubscriptionService.findPermission(user.id);

      if (userSubscription) {
        const subscriptionToken = await this.authService.createJWTToken(
          user.id,
          {
            subscription: userSubscription.subscription,
            endDate: userSubscription.endDate.getTime(),
          },
        );
        // todo увеличить продолжительность жизни токена СПРОСИТЬ ПАВЛА
        res.cookie('user_subscription', subscriptionToken, cookieOptions);
      }
      // todo удалить cookies, которые добавил в процессе авторизации
      return {
        message: 'Token successfully received',
        status: 'ok',
        redirectTo,
      };
    } catch (e) {
      this.logger.error(
        `func: handleGetToken, Failed to get access token. ${e.message}`,
      );
      throw new InternalServerErrorException(e.message);
    }
  }

  @UseGuards(ApiInternalGuard)
  @Post('refresh-token')
  async handleRefreshToken(
    @Body() { user_vkid }: { user_vkid: number },
  ): Promise<SuccessResponseType<{ access_token: string }>> {
    const user = await this.userService.findOne(user_vkid);

    if (!user) {
      this.logger.error(`User with id = ${user_vkid} not found`);
      throw new HttpException(
        {
          error: {
            status: HttpStatus.NOT_FOUND,
            message: 'Пользователь не найден',
            code: 'not found',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await this.authService.refreshAccessToken(
        user.refresh_token,
        user.device_id,
      );

      const expires_date = this.authService.calcUserTokenExpiresDate(
        response.expires_in,
      );

      await this.authService.saveUser(
        user_vkid,
        response.access_token,
        response.refresh_token,
        user.device_id,
        expires_date,
      );

      return {
        data: { access_token: response.access_token },
        success: {
          status: HttpStatus.OK,
          message: 'Token successfully received',
          code: 'success',
        },
      };
    } catch (e) {
      this.logger.error(
        `func:handleRefreshToken,Failed to get access token. ${e.message}`,
      );
      throw new HttpException(
        `Token received failed: ${e.message}`,
        HttpStatus.NOT_FOUND,
      );

      // todo сделать сообщения для пользователя и в сообщении рассказать о проблеме
      // throw new InternalServerErrorException(e.message);
    }
  }
}
