import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { UserWorkGroupController } from './controllers/user-work-group.controller';
import { VkDataModule } from 'src/vk-data/vkdata.module';

@Module({
  imports: [HttpModule, DBModule, VkDataModule],
  controllers: [UserWorkGroupController],
})
export class FrontModule {}
