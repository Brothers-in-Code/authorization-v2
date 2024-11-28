import { Module } from '@nestjs/common';
import { ScanApiService } from './scan-api.service';
import { ScanApiController } from './scan-api.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { DBModule } from 'src/db/db.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, AuthModule, DBModule],
  providers: [ScanApiService],
  controllers: [ScanApiController],
})
export class ScanApiModule {}
