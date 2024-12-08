import { Module } from '@nestjs/common';
import { VkWallDataController } from './vk-wall.controller';
import { VkWallDataService } from './vk-wall.service';
import { HttpModule } from '@nestjs/axios';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [HttpModule, DBModule],
  controllers: [VkWallDataController],
  providers: [VkWallDataService],
})
export class VkWallDataModule {}
