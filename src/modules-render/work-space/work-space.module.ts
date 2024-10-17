import { Module } from '@nestjs/common';
import { WorkSpaceService } from './work-space.service';
import { WorkSpaceController } from './work-space.controller';
import { DBModule } from 'src/db/db.module';
import { VkDataModule } from 'src/modules/vk-data/vkdata.module';

@Module({
  imports: [DBModule, VkDataModule],
  providers: [WorkSpaceService],
  controllers: [WorkSpaceController],
})
export class WorkSpaceModule {}
