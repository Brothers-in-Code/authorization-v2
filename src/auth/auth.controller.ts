import { Controller, Get, Response } from '@nestjs/common';
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
    return res.redirect(this.configService.get('app.frontend'));
  }
}
