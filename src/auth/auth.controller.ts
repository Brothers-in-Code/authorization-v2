import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('verification')
  verification() {
    return this.authService.createVerificationState();
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
    const isStateVerified = this.authService.verifyState(state);

    if (isStateVerified) {
      try {
        const data = this.authService.getAccessToken(code, device_id);
        return data;
      } catch (e) {
        return { error: e };
      }
    }

    return { error: 'State verification failed' };
  }
}
