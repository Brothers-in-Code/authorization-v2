import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Redirect('/home', 302)
  redirectHome() {
    return {};
  }

  //   TODO удалить если будет работать штатно
  //   @Get()
  //   getHello(): string {
  //     return this.appService.getHello();
  //   }
}
