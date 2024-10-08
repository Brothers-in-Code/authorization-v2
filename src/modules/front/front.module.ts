import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { VkDataModule } from 'src/modules/vk-data/vkdata.module';
import { UserWorkGroupController } from './controllers/user-work-group.controller';

@Module({
  imports: [HttpModule, DBModule, VkDataModule],
  controllers: [UserWorkGroupController],
})
export class FrontModule {}
