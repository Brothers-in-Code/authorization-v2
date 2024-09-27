import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  const port = parseInt(process.env.PORT, 10) || 3000;
  await app.listen(port);
  console.log('listen', port);
}
bootstrap();
