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
  async receiveDataGroups(
    @Param('id') id: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
    @Body()
    body: {
      isScan: string;
      searchName: string;
      scanGroupStatus?: { groupVkId: string; isScan: boolean }[];
      addGroupByIdOrDomain?: string;
      filterGroupByIdOrName?: string;
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

    if (body.addGroupByIdOrDomain !== undefined) {
      await this.workSpaceService.addGroupToUser(Number(id), {
        groupIdOrDomain: body.addGroupByIdOrDomain,
      });
    }

    const userGroupList = await this.workSpaceService.getGroupList({
      user_id: Number(id),
      offset: Number(offset),
      limit: Number(limit),
      is_scan: isScanLocal,
      filterGroupByIdOrName: body.filterGroupByIdOrName,
    });

    const dataToRender = {
      pageTitle: 'Группы ВК',
      userId: id,
      currentPage: 'groups',
      currentIsScan: body.isScan,
      filterGroupByIdOrName: body.filterGroupByIdOrName,
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
    const dataToRender = await this.workSpaceService.collectDataToRender(id, {
      offset,
      limit,
      likesMin,
      viewsMin,
      begDate,
      endDate,
    });
    return { data: dataToRender };
  }

  @Post('work-space/:id/posts')
  @Render('pages/posts')
  async receivePosts(
    @Param('id') id: string,
    @Body()
    body: {
      likesMin: string;
      viewsMin: string;
      begDate: string;
      endDate: string;
      comments?: { post_id: number; text: string }[];
      report?: {
        report: {
          reportId: string;
          isNewReport: boolean;
          reportName: string;
          reportDescription: string;
        };
        postList: { post_id: number; comment: string }[];
      };
    },
  ) {
    this.logger.debug(JSON.stringify(body.report));

    if (body.report !== undefined) {
      const { report, postList } = body.report;
      let reportId: number;

      if (body.report.report.isNewReport) {
        const newReport = await this.workSpaceService.saveReport(
          report.reportName,
          report.reportDescription,
        );
        reportId = newReport.id;
        this.logger.debug(JSON.stringify(newReport));
      } else {
        reportId = Number(report.reportId);
      }

      if (postList !== undefined && postList.length > 0) {
        const savedComments = await this.workSpaceService.saveComment(
          Number(id),
          {
            reportId,
            postList,
          },
        );
        this.logger.debug(JSON.stringify(savedComments));
      }
    }

    const dataToRender = await this.workSpaceService.collectDataToRender(id, {
      ...body,
      offset: 0,
      limit: 20,
    });

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
