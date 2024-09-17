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
  // TODO поставить httpOnly: true
  httpOnly: false,
  secure: true,
  samesite: 'strict',
};

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @Get('verification')
  verification(
    @Res({ passthrough: true }) res: Response,
  ): VerificationOutputType {
    const encryptKey = this.configService.get('app.encryptKey');
    const verificationState = this.authService.createVerificationState();
    // TODO зашифровать code_verifier

    const enTest = encrypt('test', encryptKey);

    Logger.log('enTest', enTest);

    res.cookie('test', enTest);
    res.cookie('state', verificationState.state, cookieOptions);
    res.cookie('code_verifier', verificationState.code_verifier, cookieOptions);

    return verificationState;
  }

  @Post('access')
  handlePostAccess(
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
    const cookieCodeVerifier = req.cookies?.code_verifier || null;
    const cookieTest = req.cookies?.test || null;
    const deTest = decrypt(cookieTest, encryptKey);
    Logger.log('deTest', deTest);

    // TODO расшифровать code_verifier
    const isStateVerified = this.authService.verifyState(state, cookieState);

    if (isStateVerified && cookieCodeVerifier) {
      try {
        return this.authService.getAccessToken(
          code,
          device_id,
          cookieCodeVerifier,
        );
      } catch (e) {
        // TODO log the error
        throw new InternalServerErrorException(e.message);
      }
    }

    throw new UnauthorizedException(
      'State verification failed or missing code_verifier',
    );
  }
}
