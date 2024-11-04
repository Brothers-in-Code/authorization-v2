import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class HomeController {
  @Get('home')
  @Render('pages/home')
  renderHome() {
    return {
      data: {
        pageTitle: 'Home',
      },
    };
  }
}
