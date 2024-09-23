import { Module } from '@nestjs/common';
import { VkDataController } from './vk-data.controller';
import { VkDataService } from './vk-data.service';

@Module({
  controllers: [VkDataController],
  providers: [VkDataService]
})
export class VkDataModule {}
