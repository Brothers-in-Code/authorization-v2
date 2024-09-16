import {
  UnauthorizedException,
  InternalServerErrorException,
  Body,
  Controller,
  Get,
  Post,
  Res,
  Logger,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { Response } from 'express';

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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('verification')
  verification(): VerificationOutputType {
    const state = this.authService.createVerificationState();
    // TODO save code_verifier to cookies

    return state;
  }

  @Post('access')
  handlePostAccess(
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
    // TODO get code_verifier from cookies
    const isStateVerified = this.authService.verifyState(state);

    if (isStateVerified) {
      try {
        // pass the code_verifier to the method
        return this.authService.getAccessToken(code, device_id);
      } catch (e) {
        // TODO log the error
        throw new InternalServerErrorException(e.message);
      }
    }

    throw new UnauthorizedException('State verification failed');
  }
}
