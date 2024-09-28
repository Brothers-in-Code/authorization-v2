import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { GroupController } from './controllers/group.controller';

@Module({
  imports: [HttpModule, DBModule],
  controllers: [GroupController],
})
export class FrontModule {}
