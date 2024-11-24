import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserReport } from '../entities/user_report.entity';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { ReportService } from './report.service';
import { Report } from '../entities/report.entity';

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

  async getUserReportExtendedList(data: {
    userId: number;
    offset: number;
    limit: number;
  }): Promise<{
    total: number;
    offset: number;
    limit: number;
    userId: number;
    reports: Report[];
  }> {
    const total = await this.userReportRepository.count({
      where: { user: { id: data.userId } },
    });
    const result = await this.userReportRepository.find({
      where: { user: { id: data.userId } },
      relations: ['report'],
      skip: data.offset,
      take: data.limit,
    });
    const reports = result.map((item) => {
      delete item.report.deleted_at;
      delete item.report.updated_at;
      return item.report;
    });

    return {
      total,
      offset: data.offset,
      limit: data.limit,
      userId: data.userId,
      reports,
    };
  }

  async getUserReportList(userId: number) {
    const result = await this.userReportRepository.find({
      where: { user: { id: userId } },
      relations: ['report'],
      order: { report: { updated_at: 'DESC' } },
    });

    const reportList = result.map((item) => {
      delete item.report.deleted_at;
      delete item.report.updated_at;
      return item.report;
    });
    // TODO переименовать на reports типизировать ответ
    return {
      userId,
      reportList,
    };
  }
}
