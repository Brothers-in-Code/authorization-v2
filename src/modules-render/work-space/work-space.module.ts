import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DBModule } from 'src/db/db.module';
import { WorkSpaceService } from './work-space.service';
import { WorkSpaceController } from './work-space.controller';
import { VkDataModule } from 'src/modules/vk-data/vkdata.module';
import { UserGuard } from 'src/guards/user-guard/user.guard';

@Module({
  imports: [DBModule, VkDataModule, JwtModule],
  controllers: [WorkSpaceController],
  providers: [WorkSpaceService, UserGuard],
})
export class WorkSpaceModule {}
