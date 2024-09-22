import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [HttpModule, UserModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
