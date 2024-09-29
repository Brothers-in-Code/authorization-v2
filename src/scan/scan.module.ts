import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ScanServiceService } from 'src/scan/scan-service/scan-service.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [ScanServiceService],
})
export class ScanModule {}
