import { Module } from '@nestjs/common';
import { WorkSpaceService } from './work-space.service';
import { WorkSpaceController } from './work-space.controller';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule],
  providers: [WorkSpaceService],
  controllers: [WorkSpaceController],
})
export class WorkSpaceModule {}
