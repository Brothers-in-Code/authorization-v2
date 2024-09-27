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
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { Response } from 'express';

import { encrypt, decrypt } from '../utils/crypting';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/db/services/user.service';

type VerificationOutputType = {
  client_id: number;
  redirect_uri: string;
  response_type: string;
  code_verifier: string;
  code_challenge: string;
  code_challenge_method: string;
  state: string;
  scopes: string;
  display: string;
};

type AuthBaseOutputType = {
  message: string;
  status: string;
  error?: any;
};

const cookieOptions = {
  httpOnly: true,
  secure: true,
  samesite: 'strict',
};

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  private readonly logger = new Logger(AuthController.name);

  @Get('verification')
  verification(
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

    return verificationState;
  }

  @Post('get-token')
  async handleGetToken(
    @Req() req: any,
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
    const codeVerifier = decrypt(hashCodeVerifier, encryptKey);

    const isStateVerified = this.authService.verifyState(state, cookieState);

    if (isStateVerified && codeVerifier) {
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

        const expires_date = this.authService.calcExpiresDate(
          response.expires_in,
        );

        await this.authService.saveUser(
          response.user_id,
          response.access_token,
          response.refresh_token,
          response.device_id,
          expires_date,
        );

        return { message: 'Token successfully received', status: 'ok' };
      } catch (e) {
        this.logger.error(`Failed to get access token. ${e}`);
        throw new InternalServerErrorException(e.message);
      }
    }

    throw new UnauthorizedException(
      'State verification failed or missing code_verifier',
    );
  }

  @Post('refresh-token')
  async handleRefreshToken(
    @Body() { user_vkid }: { user_vkid: number },
  ): Promise<AuthBaseOutputType> {
    const user = await this.userService.findOne(user_vkid);
    if (!user) {
      this.logger.error(`User with id = ${user_vkid} not found`);
      return {
        message: `User with id = ${user_vkid} not found`,
        status: 'error',
      };
    }
    try {
      const response = await this.authService.refreshAccessToken(
        user.refresh_token,
        user.device_id,
      );

      if (!response.hasOwnProperty('access_token')) {
        return {
          message: 'Token not received',
          status: 'error',
          error: response,
        };
      }
      const expires_date = this.authService.calcExpiresDate(
        response.expires_in,
      );

      await this.authService.saveUser(
        user_vkid,
        response.access_token,
        response.refresh_token,
        user.device_id,
        expires_date,
      );

      return { message: 'Token successfully received', status: 'ok' };
    } catch (e) {
      this.logger.error(`Failed to get access token. ${e.message}`);
      throw new InternalServerErrorException(e.message);
    }
  }
}
