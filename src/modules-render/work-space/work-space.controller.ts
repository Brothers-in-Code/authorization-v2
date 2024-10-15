import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Render,
} from '@nestjs/common';
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
    const userGroupList = await this.workSpaceService.getGroupList({
      user_id: Number(id),
      offset: Number(offset),
      limit: Number(limit),
    });
    const dataToRender = {
      pageTitle: 'Группы ВК',
      userId: id,
      currentPage: 'groups',
      userGroupList,
    };
    return { data: dataToRender };
  }

  @Get('work-space/:id/groups')
  @Render('pages/groups')
  async renderGroups(
    @Param('id') id: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
    @Query('is_scan') is_scan: string,
  ) {
    const is_scan_local = isNaN(Number(is_scan)) ? undefined : Number(is_scan);

    Logger.log(is_scan);
    const userGroupList = await this.workSpaceService.getGroupList({
      user_id: Number(id),
      offset: Number(offset),
      limit: Number(limit),
      is_scan: is_scan_local,
    });
    const dataToRender = {
      pageTitle: 'Группы ВК',
      userId: id,
      currentPage: 'groups',
      currentIsScan: is_scan,
      userGroupList,
    };

    return { data: dataToRender };
  }

  //   NOTE продумать как получать из getGroupList все записи
  @Get('work-space/:id/posts')
  @Render('pages/posts')
  async renderPosts(
    @Param('id') id: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
    @Query('likesMin') likesMin: string,
    @Query('viewsMin') viewsMin: string,
    @Query('begDate') begDate: string,
    @Query('endDate') endDate: string,
  ) {
    const likesMinLocal = likesMin ? Number(likesMin) : undefined;
    const viewsMinLocal = viewsMin ? Number(viewsMin) : undefined;
    const begDateLocal = begDate ? new Date(begDate).getTime() : undefined;
    const endDateLocal = endDate ? new Date(endDate).getTime() : undefined;

    const postList = await this.workSpaceService.getPostList({
      user_id: Number(id),
      offset: Number(offset),
      limit: Number(limit),
      likesMin: likesMinLocal,
      viewsMin: viewsMinLocal,
      begDate: begDateLocal,
      endDate: endDateLocal,
    });

    const dataToRender = {
      pageTitle: 'Посты',
      userId: id,
      currentPage: 'posts',
      postList,
      likesMin,
      viewsMin,
      begDate,
      endDate,
    };
    return { data: dataToRender };
  }

  @Post('work-space/:id/posts')
  @Render('pages/posts')
  async receiveFilterPosts(
    @Param('id') id: string,
    @Body()
    data: {
      likesMin: string;
      viewsMin: string;
      begDate: string;
      endDate: string;
    },
  ) {
    const likesMin = data.likesMin ? Number(data.likesMin) : undefined;
    const viewsMin = data.viewsMin ? Number(data.viewsMin) : undefined;
    const begDate = data.begDate ? new Date(data.begDate).getTime() : undefined;
    const endDate = data.endDate ? new Date(data.endDate).getTime() : undefined;

    const postList = await this.workSpaceService.getPostList({
      user_id: Number(id),
      offset: 0,
      limit: 20,
      likesMin,
      viewsMin,
      begDate,
      endDate,
    });

    const dataToRender = {
      pageTitle: 'Посты',
      userId: id,
      currentPage: 'posts',
      postList,
      likesMin,
      viewsMin,
      begDate: data.begDate,
      endDate: data.endDate,
    };
    return { data: dataToRender };
  }

  @Get('work-space/:id/reports')
  @Render('pages/reports')
  renderReports(@Param('id') id: string) {
    const dataToRender = {
      page_title: 'Отчеты',
      user_id: id,
      currentPage: 'reports',
    };

    return { data: dataToRender };
  }
}
