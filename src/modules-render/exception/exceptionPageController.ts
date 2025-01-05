import { Controller, Get, Logger, Query, Render } from '@nestjs/common';

@Controller('internal-server-error')
export class ExceptionPageController {
  @Get()
  @Render('pages/exception')
  async renderPage(@Query('regirectTo') regirectTo = 'work-space/groups') {
    return {
      data: { regirectTo },
    };
  }
}
