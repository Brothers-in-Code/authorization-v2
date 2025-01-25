import { Module } from '@nestjs/common';
import { ExceptionPageController } from './exception-page.controller';

@Module({
  controllers: [ExceptionPageController],
})
export class ExceptionPageModule {}
