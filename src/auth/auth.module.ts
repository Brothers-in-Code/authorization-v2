import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [HttpModule, DBModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
