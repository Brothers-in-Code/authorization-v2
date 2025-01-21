import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class LandingController {
  @Get('landing')
  @Render('pages/landing')
  renderLanding() {
    return {
      data: {
        pageTitle: 'Landing',
      },
    };
  }
}
