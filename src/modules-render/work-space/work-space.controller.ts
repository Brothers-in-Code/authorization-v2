import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Redirect,
  Render,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WorkSpaceService } from './work-space.service';
import { UserGroupService } from 'src/db/services/user-group.service';
import { UserGuard } from 'src/modules/user-guard/user.guard';

@UseGuards(UserGuard)
@Controller()
export class WorkSpaceController {
  constructor(
    private readonly workSpaceService: WorkSpaceService,
    private readonly userGroupService: UserGroupService,
  ) {}

  private readonly logger = new Logger(WorkSpaceController.name);

  @Get('work-space/')
  @Redirect('')
  async renderWorkSpace(
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
  ) {
    const url = `groups?offset=${offset}&limit=${limit}`;
    return { url };
  }

  @Get('work-space/groups')
  @Render('pages/groups')
  async renderGroups(
    @Request() req,
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
    @Query('isScan') isScan: string,
    @Query('filterGroupByIdOrName') filterGroupByIdOrName: string,
  ) {
    const userId = req.user.id;
    const dataToRender = await this.workSpaceService.collectGroupDataToRender(
      userId,
      {
        offset,
        limit,
        isScan: isScan,
        filterGroupByIdOrName: filterGroupByIdOrName,
      },
    );
    return { data: dataToRender };
  }

  @Post('work-space/groups')
  @Render('pages/groups')
  async receiveGroups(
    @Request() req,
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
    const userId = req.user.id;
    if (body.scanGroupStatus !== undefined) {
      await this.userGroupService.updateIsScanStatus(
        Number(userId),
        body.scanGroupStatus,
      );
    }

    if (body.addGroupByIdOrDomain !== undefined) {
      await this.workSpaceService.addGroupToUser(Number(userId), {
        groupIdOrDomain: body.addGroupByIdOrDomain,
      });
    }

    const dataToRender = await this.workSpaceService.collectGroupDataToRender(
      userId,
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
  //   FIX likesMin, viewsMin - сделать по умолчанию 0 или null  (ошибка: The specified value "NaN" cannot be parsed, or is out of range.)
  //   NOTE проверить как сохраняются комментарии (должно быть update, если такой пост в отчет добавлен)
  @Get('work-space/posts')
  @Render('pages/posts')
  async renderPosts(
    @Request() req,
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
    @Query('likesMin') likesMin: string,
    @Query('viewsMin') viewsMin: string,
    @Query('begDate') begDate: string,
    @Query('endDate') endDate: string,
    @Query('sortByLikes') sortByLikes: '0' | '1' | '2' | undefined,
    @Query('sortByViews') sortByViews: '0' | '1' | '2' | undefined,
    @Query('sortByComments') sortByComments: '0' | '1' | '2' | undefined,
  ) {
    const userId = req.user.id;
    const dataToRender = await this.workSpaceService.collectPostDataToRender(
      userId,
      {
        offset,
        limit,
        likesMin,
        viewsMin,
        begDate,
        endDate,
        sortByLikes,
        sortByViews,
        sortByComments,
      },
    );
    return { data: dataToRender };
  }

  @Post('work-space/posts')
  @Render('pages/posts')
  async receivePosts(
    @Request() req,
    @Body()
    body: {
      likesMin: string;
      viewsMin: string;
      begDate: string;
      endDate: string;
      sortByLikes: '0' | '1' | '2';
      sortByViews: '0' | '1' | '2' | undefined;
      sortByComments: '0' | '1' | '2' | undefined;
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
    const userId = req.user.id;
    if (body.report !== undefined) {
      const { report, postList } = body.report;
      let reportId: number;

      if (body.report.report.isNewReport) {
        const newReport = await this.workSpaceService.saveReport(
          report.reportName,
          report.reportDescription,
        );
        reportId = newReport.id;
        await this.workSpaceService.addReportToUser(
          Number(userId),
          newReport.id,
        );
      } else {
        reportId = Number(report.reportId);
      }

      if (postList !== undefined && postList.length > 0) {
        const savedComments = await this.workSpaceService.saveComment(
          Number(userId),
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
      userId,
      {
        ...body,
        offset: 0,
        limit: 20,
      },
    );
    return { data: dataToRender };
  }

  @Get('work-space/reports')
  @Render('pages/reports')
  async renderReports(
    @Request() req,
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
  ) {
    const userId = req.user.id;
    const dataToRender =
      await this.workSpaceService.collectReportListDataToRender(userId, {
        offset,
        limit,
      });

    return { data: dataToRender };
  }
  // TODO сделать guard для отчетов
  @Get('work-space/reports/:reportId')
  @Render('pages/one-report.ejs')
  async renderReport(@Request() req, @Param('reportId') reportId: string) {
    const userId = req.user.id;
    const report = await this.workSpaceService.collectReportDataToRender(
      Number(reportId),
    );
    const dataToRender = {
      pageTitle: 'Отчет',
      report,
    };
    return {
      data: dataToRender,
    };
  }

  @Post('work-space/reports/:reportId')
  @Render('pages/one-report.ejs')
  async receiveReport(
    @Request() req,
    @Param('reportId') reportId: string,
    @Body()
    body: {
      reportName: string;
      reportDescription: string;
    },
  ) {
    const userId = req.user.id;
    if (body) {
      await this.workSpaceService.updateReport(Number(reportId), body);
    }
    const report = await this.workSpaceService.collectReportDataToRender(
      Number(reportId),
    );
    const dataToRender = {
      pageTitle: 'Отчет',
      report,
      message: 'Название и описание отчета обновлены',
    };
    return {
      data: dataToRender,
    };
  }

  @Delete('work-space/reports/:reportId')
  @Render('pages/one-report.ejs')
  async deleteReport(
    @Request() req,
    @Param('reportId') reportId: string,
    @Body() body: { commentId: string },
  ) {
    const userId = req.user.id;

    const result = await this.workSpaceService.deleteCommentFromReport(
      Number(reportId),
      Number(body.commentId),
    );
    this.logger.debug(JSON.stringify(result));

    const report = await this.workSpaceService.collectReportDataToRender(
      Number(reportId),
    );

    const dataToRender = {
      pageTitle: 'Отчет',
      report,
      message: 'Комментарий удалён',
    };
    return {
      data: dataToRender,
    };
  }
}
