import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from 'src/auth/auth.module';
import { VkDataModule } from 'src/vk-data/vkdata.module';
import { ScanService } from 'src/scan/scan-service/scan-service.service';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule, VkDataModule, DBModule],
  providers: [ScanService],
})
export class ScanModule {}
