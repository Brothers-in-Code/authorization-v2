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

import { encrypt, decrypt } from 'src/utils/crypting';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

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

  @Post('access')
  async handlePostAccess(
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
  ) {
    const encryptKey = this.configService.get('app.encryptKey');
    const cookieState = req.cookies?.state || null;
    const hashCodeVerifier = req.cookies?.code_verifier || null;
    const codeVerifier = decrypt(hashCodeVerifier, encryptKey);

    const isStateVerified = this.authService.verifyState(state, cookieState);

    if (isStateVerified && codeVerifier) {
      try {
        const data = await this.authService.getAccessToken(
          code,
          device_id,
          codeVerifier,
        );

        const expires_date = this.authService.calcExpiresDate(data.expires_in);

        return this.authService.saveUser(
          data.user_id,
          data.access_token,
          data.refresh_token,
          expires_date,
        );
      } catch (e) {
        this.logger.error(`Failed to get access token. ${e}`);
        throw new InternalServerErrorException(e.message);
      }
    }

    throw new UnauthorizedException(
      'State verification failed or missing code_verifier',
    );
  }
}
