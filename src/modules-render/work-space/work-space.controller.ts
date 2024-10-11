import { Controller, Get, Param, Render } from '@nestjs/common';
import { WorkSpaceService } from './work-space.service';

@Controller()
export class WorkSpaceController {
  constructor(private readonly workSpaceService: WorkSpaceService) {}

  @Get('work-space/:id')
  @Render('pages/groups')
  renderWorkSpace(@Param('id') id: string) {
    const data = { page_title: 'Группы ВК', user_id: id };
    return { data };
  }

  @Get('work-space/:id/groups')
  @Render('pages/groups')
  async renderGroups(@Param('id') id: string) {
    const userGroupList = await this.workSpaceService.getGroupList(Number(id));
    const data = {
      pageTitle: 'Группы ВК',
      userId: id,
      currentPage: 'groups',
      userGroupList,
    };
    return { data };
  }

  @Get('work-space/:id/posts')
  @Render('pages/posts')
  renderPosts(@Param('id') id: string) {
    const data = { page_title: 'Посты', user_id: id, currentPage: 'posts' };
    return { data };
  }

  @Get('work-space/:id/reports')
  @Render('pages/reports')
  renderReports(@Param('id') id: string) {
    const data = { page_title: 'Отчеты', user_id: id, currentPage: 'reports' };

    return { data };
  }
}
