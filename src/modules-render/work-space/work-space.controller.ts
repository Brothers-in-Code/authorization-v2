import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class WorkSpaceController {
  @Get('work-space')
  @Render('index')
  getWorkSpace() {
    return {};
  }
}
