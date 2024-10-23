import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserReport } from '../entities/user_report.entity';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { ReportService } from './report.service';

@Injectable()
export class UserReportService {
  constructor(
    @InjectRepository(UserReport)
    private readonly userReportRepository: Repository<UserReport>,
    private readonly userService: UserService,
    private readonly reportService: ReportService,
  ) {}

  async create(data: { userId: number; reportId: number }) {
    // TODO узнать у Павла нужны ли эти проверки
    const user = await this.userService.findOneById(data.userId);
    if (!user) {
      throw new NotFoundException(
        `func: create,  Пользователь ${data.userId} не найден`,
      );
    }
    // TODO узнать у Павла нужны ли эти проверки
    const report = await this.reportService.findOne(data.reportId);
    if (!report) {
      throw new NotFoundException(
        `func: create,  Отчёт ${data.reportId} не найден`,
      );
    }

    return this.userReportRepository.save({
      user: { id: data.userId },
      report: { id: data.reportId },
    });
  }

  async getUserReportList(userId: number) {
    const reports = await this.userReportRepository.find({
      where: { user: { id: userId } },
      relations: ['report'],
    });

    const reportList = reports.map((item) => {
      delete item.report.created_at;
      delete item.report.deleted_at;
      delete item.report.updated_at;
      return item.report;
    });

    return {
      userId,
      reportList,
    };
  }
}
