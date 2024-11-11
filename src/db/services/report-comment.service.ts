import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async checkCommentsOfReport(
    reportId: number,
    postIdList: number[],
  ): Promise<number[]> {
    const result = await this.reportCommentRepository
      .createQueryBuilder('rc')
      .select('DISTINCT p.id', 'id')
      .innerJoin('rc.report', 'r')
      .innerJoin('rc.comment', 'c')
      .innerJoin('c.post', 'p')
      .where('r.id = :reportId', { reportId })
      .andWhere('p.id IN (:...postIdList)', { postIdList })
      .getRawMany();

    return result.map((row) => row.id);
  }

  async deleteComment(reportId: number, commentId: number) {
    const reportComment = await this.reportCommentRepository.findOneBy({
      report: { id: reportId },
      comment: { id: commentId },
    });

    if (!reportComment) {
      throw new NotFoundException(
        `Comment with reportId ${reportId} and commentId ${commentId} not found`,
      );
    }

    return this.reportCommentRepository.softDelete(reportComment.id);
  }
}
