import { Controller, Get, Query, Response } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @Get('verification')
  verification() {
    return this.authService.sendVerificationState();
  }

  @Get('vk')
  vk(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('device_id') device_id: string,
  ) {
    return { code, state, device_id };
  }
}
