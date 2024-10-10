import { Module } from '@nestjs/common';
import { WorkSpaceService } from './work-space.service';
import { WorkSpaceController } from './work-space.controller';

@Module({
  providers: [WorkSpaceService],
  controllers: [WorkSpaceController],
})
export class WorkSpaceModule {}
