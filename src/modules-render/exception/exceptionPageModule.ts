import { Module } from '@nestjs/common';
import { ExceptionPageController } from './exceptionPageController';

@Module({
  controllers: [ExceptionPageController],
})
export class ExceptionPageModule {}
