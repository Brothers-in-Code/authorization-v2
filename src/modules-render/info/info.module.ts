import { Module } from '@nestjs/common';
import { InfoController } from './info.controller';

import { LandingController } from 'src/modules-render/info/landing.controller';

@Module({
  controllers: [InfoController, LandingController],
})
export class InfoModule {}
