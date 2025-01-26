import { Module } from '@nestjs/common';
import { InfoController } from './info.controller';

import { LandingController } from 'src/modules-render/info/landing.controller';
import { LandingService } from './landing.service';

@Module({
  controllers: [InfoController, LandingController],
  providers: [LandingService],
})
export class InfoModule {}
