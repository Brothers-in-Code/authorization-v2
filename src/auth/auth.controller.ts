import {
  UnauthorizedException,
  InternalServerErrorException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('verification')
  // TODO add output types
  verification() {
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
    // TODO get code_verifier to cookies
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
