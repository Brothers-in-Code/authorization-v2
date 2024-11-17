import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class LoginController {
  @Get('login')
  @Render('pages/login')
  async renderLogin() {
    return {
      data: {
        pageTitle: 'Авторизация',
      },
    };
  }
}
