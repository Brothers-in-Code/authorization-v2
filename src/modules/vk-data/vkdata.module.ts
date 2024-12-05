import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DBModule } from 'src/db/db.module';
import { VkDataController } from './controllers/vkdata.controller';
import { VkDataService } from './services/vkdata.service';
import { VkWallDataModule } from './vk-wall/vk-wall.module';

@Module({
  imports: [HttpModule, DBModule, VkWallDataModule],
  providers: [VkDataService],
  controllers: [VkDataController],
  exports: [VkDataService],
})
export class VkDataModule {}
