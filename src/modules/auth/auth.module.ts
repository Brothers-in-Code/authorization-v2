import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DBModule } from 'src/db/db.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    HttpModule,
    DBModule,
    JwtModule.register({
      global: true,
      secret: process.env.APP_JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
