import { Module } from '@nestjs/common';
import { VkDataController } from './controllers/vkdata.controller';
import { VkDataService } from './services/vkdata.service';
import { HttpModule } from '@nestjs/axios';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [HttpModule, DBModule],
  providers: [VkDataService],
  controllers: [VkDataController],
})
export class VkDataModule {}
