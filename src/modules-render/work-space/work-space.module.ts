import { Module } from '@nestjs/common';
import { WorkSpaceService } from './work-space.service';
import { WorkSpaceController } from './work-space.controller';
import { DBModule } from 'src/db/db.module';
import { VkDataModule } from 'src/modules/vk-data/vkdata.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DBModule, VkDataModule, JwtModule],
  providers: [WorkSpaceService],
  controllers: [WorkSpaceController],
})
export class WorkSpaceModule {}
