import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Render,
} from '@nestjs/common';
import { WorkSpaceService } from './work-space.service';
import { UserGroupService } from 'src/db/services/user-group.service';

@Controller()
export class WorkSpaceController {
  constructor(
    private readonly workSpaceService: WorkSpaceService,
    private readonly userGroupService: UserGroupService,
  ) {}

  private readonly logger = new Logger(WorkSpaceController.name);

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
    @Query('isScan') isScan: string,
  ) {
    const isScanLocal = isNaN(Number(isScan)) ? undefined : Number(isScan);

    const userGroupList = await this.workSpaceService.getGroupList({
      user_id: Number(id),
      offset: Number(offset),
      limit: Number(limit),
      is_scan: isScanLocal,
    });
    const dataToRender = {
      pageTitle: 'Группы ВК',
      userId: id,
      currentPage: 'groups',
      currentIsScan: isScan,
      userGroupList,
    };
    return { data: dataToRender };
  }

  @Post('work-space/:id/groups')
  @Render('pages/groups')
  async receiveFilterGroups(
    @Param('id') id: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
    @Body()
    body: {
      isScan: string;
      searchName: string;
      scanGroupStatus?: { groupVkId: string; isScan: boolean }[];
    },
  ) {
    const isScanLocal = isNaN(Number(body.isScan))
      ? undefined
      : Number(body.isScan);

    if (body.scanGroupStatus !== undefined) {
      await this.userGroupService.updateIsScanStatus(
        Number(id),
        body.scanGroupStatus,
      );
    }

    const userGroupList = await this.workSpaceService.getGroupList({
      user_id: Number(id),
      offset: Number(offset),
      limit: Number(limit),
      is_scan: isScanLocal,
    });

    const dataToRender = {
      pageTitle: 'Группы ВК',
      userId: id,
      currentPage: 'groups',
      currentIsScan: body.isScan,
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
    body: {
      likesMin: string;
      viewsMin: string;
      begDate: string;
      endDate: string;
    },
  ) {
    const likesMin = body.likesMin ? Number(body.likesMin) : undefined;
    const viewsMin = body.viewsMin ? Number(body.viewsMin) : undefined;
    const begDate = body.begDate ? new Date(body.begDate).getTime() : undefined;
    const endDate = body.endDate ? new Date(body.endDate).getTime() : undefined;

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
      begDate: body.begDate,
      endDate: body.endDate,
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
