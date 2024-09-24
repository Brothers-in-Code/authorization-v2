import { Module } from '@nestjs/common';
import { VkDataController } from './vkdata.controller';
import { VkDataService } from './vkdata.service';
import { HttpModule } from '@nestjs/axios';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [HttpModule, DBModule],
  providers: [VkDataService],
  controllers: [VkDataController],
})
export class VkDataModule {}
