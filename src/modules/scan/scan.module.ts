import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';

import { AuthModule } from 'src/modules/auth/auth.module';
import { VkDataModule } from 'src/modules/vk-data/vkdata.module';
import { DBModule } from 'src/db/db.module';

import { ScanService } from 'src/modules/scan/scan-service/scan-service.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    VkDataModule,
    DBModule,
    HttpModule,
  ],
  providers: [ScanService],
})
export class ScanModule {}
