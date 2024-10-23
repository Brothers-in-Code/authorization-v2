import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportComment } from '../entities/report_comment.entity';
import { In, Repository } from 'typeorm';
import { ReportService } from './report.service';
import { Report } from '../entities/report.entity';
import { Comment } from '../entities/comment.entity';

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

  async findAllCommentsOfReport(
    reportId: number,
    commentIdList: number[],
  ): Promise<{ report: Report; commentList: Comment[] }> {
    const report = await this.reportService.findOne(reportId).then((item) => {
      delete item.created_at;
      delete item.deleted_at;
      delete item.updated_at;
      return item;
    });

    if (!report) {
      throw new Error(`Report with ID ${reportId} not found.`);
    }

    const result = await this.reportCommentRepository.find({
      where: { report: { id: reportId }, comment: { id: In(commentIdList) } },
      relations: ['report', 'comment'],
    });

    const commentList = result.map((item) => {
      delete item.comment.created_at;
      delete item.comment.deleted_at;
      delete item.comment.updated_at;
      return item.comment;
    });
    return {
      report,
      commentList,
    };
  }
}
