import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DBModule } from 'src/db/db.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [HttpModule, DBModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
