import { Controller, Get, Query, Render } from '@nestjs/common';

@Controller()
export class SubscriptionController {
  @Get('subscription')
  @Render('pages/subscription')
  async renderSubscription(
    @Query('redirectTo') redirectTo = 'work-space/posts',
    @Query('message') message: string,
  ) {
    return {
      data: {
        pageTitle: 'Подписка',
        redirectTo,
        message,
      },
    };
  }
}
