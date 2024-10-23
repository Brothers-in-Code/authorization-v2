import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportComment } from '../entities/report_comment.entity';
import { Repository } from 'typeorm';
import { ReportService } from './report.service';

@Injectable()
export class ReportCommentService {
  constructor(
    @InjectRepository(ReportComment)
    private reportCommentRepository: Repository<ReportComment>,
    private readonly reportService: ReportService,
  ) {}

  private readonly logger = new Logger(ReportCommentService.name);

  async create(reportCommentList: ReportComment[]) {
    return this.reportCommentRepository.save(reportCommentList);
  }

  async createList(reportId: number, commentIdList: number[]) {
    const report = await this.reportService.findOne(reportId);
    if (!report) {
      throw new Error(`Report with ID ${reportId} not found.`);
    }

    const queryBuilder = this.reportCommentRepository.createQueryBuilder();
    const insertQuery = await queryBuilder
      .insert()
      .into(ReportComment)
      .values(
        commentIdList.map((commentId) => {
          return {
            report: { id: reportId },
            comment: { id: commentId },
          };
        }),
      )
      .orIgnore()
      .execute();

    return insertQuery;
  }

  find(reportId: number, commentId: number) {
    return this.reportCommentRepository.findOne({
      where: { report: { id: reportId }, comment: { id: commentId } },
    });
  }

  createReportCommentObj() {
    return new ReportComment();
  }
}
