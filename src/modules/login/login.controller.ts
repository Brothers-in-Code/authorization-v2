import { Controller, Get, Query, Render } from '@nestjs/common';

@Controller()
export class LoginController {
  @Get('login')
  @Render('pages/login')
  async renderLogin(
    @Query('redirectTo') redirectTo = 'work-space/groups',
    @Query('message') message: string,
  ) {
    return {
      data: {
        pageTitle: 'Авторизация',
        redirectTo,
        message,
      },
    };
  }
}
