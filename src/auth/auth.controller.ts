import { Controller, Get, Response } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @Get('move')
  moveToRoute(@Response() response: express.Response) {
    const app = this.configService.get('app');
    response.redirect(`${app.frontend}?token=true`);
  }

  @Get('login')
  login() {
    return this.authService.signIn('code');
  }
}
