import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Redirect,
  Render,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { WorkSpaceService } from './work-space.service';
import { UserGroupService } from 'src/db/services/user-group.service';
import { UserGuard } from 'src/modules/user-guard/user.guard';
import { Response } from 'express';

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
    @Query('likesMin') likesMin: string | undefined,
    @Query('viewsMin') viewsMin: string | undefined,
    @Query('begDate') begDate: string | undefined,
    @Query('endDate') endDate: string | undefined,
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
      offset?: string;
      limit?: string;
      likesMin?: string;
      viewsMin?: string;
      begDate?: string;
      endDate?: string;
      sortByLikes?: '0' | '1' | '2';
      sortByViews?: '0' | '1' | '2';
      sortByComments?: '0' | '1' | '2';
      comments?: { post_id: number; text: string }[];
      reportId?: string;
      isNewReport?: boolean;
      reportName?: string;
      reportDescription?: string;
      postId?: number;
      comment?: string;
    },
  ) {
    const userId = req.user.id;
    let message = '';
    try {
      if (body.reportId !== undefined || body.isNewReport) {
        let reportId: number;

        if (body.isNewReport) {
          const newReport = await this.workSpaceService.saveReport(
            body.reportName,
            body.reportDescription,
          );
          reportId = newReport.id;
          await this.workSpaceService.addReportToUser(
            Number(userId),
            newReport.id,
          );
        } else {
          reportId = Number(body.reportId);
        }

        const savedComments = await this.workSpaceService.saveComment(
          Number(userId),
          {
            reportId,
            postList: [
              {
                post_id: body.postId,
                comment: body.comment,
              },
            ],
          },
        );

        await this.workSpaceService.addCommentToReport(
          reportId,
          savedComments.generatedMaps.map((comment) => comment.id),
        );
        message = 'Отчет сохранен';
      }
    } catch (error) {
      message = 'Не удалось сохранить отчет';
      this.logger.error(`func: receivePosts; error: ${error}`);
    }

    const dataToRender = await this.workSpaceService.collectPostDataToRender(
      userId,
      {
        ...body,
        offset: body.offset || 0,
        limit: body.limit || 20,
      },
    );

    dataToRender['message'] = message;

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
    @Param('reportId') reportId: string,
    @Body()
    body: {
      reportName: string;
      reportDescription: string;
    },
  ) {
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

  @Patch('work-space/reports/:reportId')
  async updateComment(
    @Param('reportId') reportId: string,
    @Body() body: { commentId: string; comment: string },
  ) {
    let message = '';

    const result = await this.workSpaceService.patchCommentText(
      Number(body.commentId),
      body.comment,
    );

    if (result.affected === 0) {
      this.logger.error(
        `Не удалось обновить комментарий. reportId: ${reportId}; commentId: ${body.commentId}`,
      );
      message = 'Не удалось обновить комментарий';
    } else {
      message = 'Комментарий обновлен';
    }
    const report = await this.workSpaceService.collectReportDataToRender(
      Number(reportId),
    );

    const dataToRender = {
      pageTitle: 'Отчет',
      report,
    };

    const htmlMainSection = await this.workSpaceService.renderMainOneReport({
      data: dataToRender,
    });

    return {
      message,
      html: htmlMainSection,
    };
  }

  @Delete('work-space/reports/:reportId')
  async deleteReport(
    @Param('reportId') reportId: string,
    @Body() body: { commentId: string },
  ) {
    let message = '';

    const result = await this.workSpaceService.deleteCommentFromReport(
      Number(reportId),
      Number(body.commentId),
    );

    if (result.affected === 0) {
      this.logger.error(
        `Не удалось удалить пост из отчета. reportId: ${reportId}; commentId: ${body.commentId}`,
      );
      message = 'Не удалось удалить пост из отчета';
    } else {
      message = 'Пост удален из отчета';
    }

    const report = await this.workSpaceService.collectReportDataToRender(
      Number(reportId),
    );

    const dataToRender = {
      pageTitle: 'Отчет',
      report,
    };

    const htmlMainSection = await this.workSpaceService.renderMainOneReport({
      data: dataToRender,
    });

    return {
      message,
      html: htmlMainSection,
    };
  }

  @Get('work-space/reports/:reportId/export-report')
  async exportReport(
    @Param('reportId') reportId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const report = await this.workSpaceService.collectReportDataToRender(
      Number(reportId),
    );
    const buffer = await this.workSpaceService.createExcelReport(report);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');
    res.send(buffer);
  }
}
