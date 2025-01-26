import { Controller, Get, Render, Request, UseGuards } from '@nestjs/common';
import { UserGuard } from 'src/guards/user-guard/user.guard';
import { LandingService } from 'src/modules-render/info/landing.service';

@UseGuards(UserGuard)
@Controller()
export class LandingController {
  constructor(private readonly landingService: LandingService) {}

  @Get('landing')
  @Render('pages/landing')
  renderLanding(@Request() request: any) {
    const userAvatar = this.landingService.getUserAvatarFromRequest(request);

    return {
      data: {
        pageTitle: 'Landing',
        user: {
          userAvatar,
        },
      },
    };
  }
}
