import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Report } from '../entities/report.entity';
import { throwError } from 'rxjs';
import { DatabaseServiceError } from 'src/errors/service-errors';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  private readonly logger = new Logger(ReportService.name);

  create(reportName: string, reportDescription: string) {
    const newReport = this.createReportObj();
    newReport.name = reportName;
    newReport.description = reportDescription;
    return this.reportRepository.save(newReport);
  }

  createReportObj() {
    return new Report();
  }

  findOne(id: number): Promise<Report> {
    return this.reportRepository.findOneBy({ id });
  }

  findByKey<T>(key: string, value: T): Promise<Report[]> {
    return this.reportRepository.find({ where: { [key]: value } });
  }

  async getReportData(reportId: number) {
    const queryBuilder = this.reportRepository.createQueryBuilder('r');
    const resultReport = await queryBuilder
      .select([
        'r.id as reportId',
        'r.*',
        'c.text as commentText',
        'p.*',
        'g.name as groupName',
        'g.vkid as groupVkId',
        'p.id as postId',
        'p.*',
      ])
      .innerJoin('report_comment', 'rc', 'rc.report_id = r.id')
      .innerJoin('rc.comment', 'c', 'rc.comment_id= c.id')
      .innerJoin('c.post', 'p')
      .innerJoin('group', 'g', 'p.group_id = g.id')
      .where('r.id = :reportId', { reportId })
      .getRawMany();

    if (!resultReport) {
      throw new DatabaseServiceError(
        `func: getReportData; Нет результатов при формировании отчета № ${reportId}`,
      );
    }

    this.logger.debug(resultReport);

    const report = {
      id: resultReport[0].reportId,
      name: resultReport[0].name,
      description: resultReport[0].description,
      date: resultReport[0].created_at,
      startDatePeriod: resultReport[0].start_date_period,
      endDatePeriod: resultReport[0].end_date_period,
    };

    const commentList = resultReport.map((item) => {
      return {
        commentText: item.commentText,
        groupName: item.groupName,
        groupId: item.groupVkId,
        post: {
          id: item.postId,
          post_vkid: item.post_vkid,
          likes: item['likes'],
          views: item['views'],
          comments: item['comments'],
          timestamp_post: item['timestamp_post'],
          json: item['json'],
        },
      };
    });

    return {
      report,
      commentList,
    };
  }
}
