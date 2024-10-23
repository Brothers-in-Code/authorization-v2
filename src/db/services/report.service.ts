import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Report } from '../entities/report.entity';

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
}
