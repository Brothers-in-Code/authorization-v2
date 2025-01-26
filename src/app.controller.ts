import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Redirect('/landing', 302)
  redirectHome() {
    return {};
  }

  @Get('/info')
  getInfo() {
    return {
      status: 'OK',
      info: this.appService.getInfo(),
    };
  }
}
