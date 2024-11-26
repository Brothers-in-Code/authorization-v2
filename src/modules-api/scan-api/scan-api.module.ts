import { Module } from '@nestjs/common';
import { ScanApiService } from './scan-api.service';
import { ScanApiController } from './scan-api.controller';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ScanApiService],
  controllers: [ScanApiController],
})
export class ScanApiModule {}
