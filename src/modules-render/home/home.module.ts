import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';

// todo проверить нужен ли
@Module({
  controllers: [HomeController],
})
export class HomeModule {}
