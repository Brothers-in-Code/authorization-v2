import { Controller, Get, Logger } from '@nestjs/common';
import { ScanService } from './scan-service.service';

// TODO добавить guard
@Controller()
export class ScanController {
  constructor(private readonly scanService: ScanService) {}
  private readonly logger = new Logger(ScanController.name);
  @Get('api/scan-service/start-scan')
  async startScan() {
    this.logger.log('получил отмашку на запуск скана');
    try {
      await this.scanService.run();
    } catch (error) {
      this.logger.error(`ошибка запуска скана ${error}`);
      throw error;
    } finally {
      this.logger.log('скан завершен');
    }
    return { message: 'скан завершен' };
  }
}
