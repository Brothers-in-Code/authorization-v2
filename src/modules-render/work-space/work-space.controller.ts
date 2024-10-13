import { Controller, Get, Logger, Param, Query, Render } from '@nestjs/common';
import { WorkSpaceService } from './work-space.service';

@Controller()
export class WorkSpaceController {
  constructor(private readonly workSpaceService: WorkSpaceService) {}

  @Get('work-space/:id')
  @Render('pages/groups')
  async renderWorkSpace(
    @Param('id') id: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
  ) {
    const userGroupList = await this.workSpaceService.getGroupList(
      Number(id),
      offset,
      limit,
    );
    const data = {
      pageTitle: 'Группы ВК',
      userId: id,
      currentPage: 'groups',
      userGroupList,
    };
    return { data };
  }

  @Get('work-space/:id/groups')
  @Render('pages/groups')
  async renderGroups(
    @Param('id') id: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
    @Query('is_scan') is_scan?: number,
  ) {
    const userGroupList = await this.workSpaceService.getGroupList(
      Number(id),
      Number(offset),
      Number(limit),
      is_scan !== undefined ? Number(is_scan) : undefined,
    );
    const data = {
      pageTitle: 'Группы ВК',
      userId: id,
      currentPage: 'groups',
      currentIsScan: is_scan,
      userGroupList,
    };

    return { data };
  }

  //   NOTE продумать как получать из getGroupList все записи
  @Get('work-space/:id/posts')
  @Render('pages/posts')
  async renderPosts(@Param('id') id: string) {
    const userGroupList = await this.workSpaceService.getGroupList(
      Number(id),
      0,
      20,
    );
    const postList = await this.workSpaceService.getPostList(
      userGroupList.groups,
    );
    const data = {
      pageTitle: 'Посты',
      userId: id,
      currentPage: 'posts',
      postList,
    };
    return { data };
  }

  @Get('work-space/:id/reports')
  @Render('pages/reports')
  renderReports(@Param('id') id: string) {
    const data = { page_title: 'Отчеты', user_id: id, currentPage: 'reports' };

    return { data };
  }
}
