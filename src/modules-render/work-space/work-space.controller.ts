import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Redirect,
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
  @Redirect('')
  async renderWorkSpace(
    @Param('id') id: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
  ) {
    const url = `${id}/groups?offset=${offset}&limit=${limit}`;
    return { url };
  }

  @Get('work-space/:id/groups')
  @Render('pages/groups')
  async renderGroups(
    @Param('id') id: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
    @Query('isScan') isScan: string,
    @Query('filterGroupByIdOrName') filterGroupByIdOrName: string,
  ) {
    const dataToRender = await this.workSpaceService.collectGroupDataToRender(
      id,
      {
        offset,
        limit,
        isScan: isScan,
        filterGroupByIdOrName: filterGroupByIdOrName,
      },
    );
    return { data: dataToRender };
  }

  @Post('work-space/:id/groups')
  @Render('pages/groups')
  async receiveGroups(
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

    const dataToRender = await this.workSpaceService.collectGroupDataToRender(
      id,
      {
        offset,
        limit,
        isScan: body.isScan,
        filterGroupByIdOrName: body.filterGroupByIdOrName,
      },
    );

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
    const dataToRender = await this.workSpaceService.collectPostDataToRender(
      id,
      {
        offset,
        limit,
        likesMin,
        viewsMin,
        begDate,
        endDate,
      },
    );
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
    if (body.report !== undefined) {
      const { report, postList } = body.report;
      let reportId: number;

      if (body.report.report.isNewReport) {
        const newReport = await this.workSpaceService.saveReport(
          report.reportName,
          report.reportDescription,
        );
        reportId = newReport.id;
        await this.workSpaceService.addReportToUser(Number(id), newReport.id);
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
        await this.workSpaceService.addCommentToReport(
          reportId,
          savedComments.generatedMaps.map((comment) => comment.id),
        );
      }
    }

    const dataToRender = await this.workSpaceService.collectPostDataToRender(
      id,
      {
        ...body,
        offset: 0,
        limit: 20,
      },
    );

    return { data: dataToRender };
  }

  @Get('work-space/:id/reports')
  @Render('pages/reports')
  async renderReports(
    @Param('id') id: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
  ) {
    const dataToRender = await this.workSpaceService.collectReportDataToRender(
      id,
      {
        offset,
        limit,
      },
    );

    return { data: dataToRender };
  }
}
