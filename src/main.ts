import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

import { join } from 'path';

import { AppModule } from './app.module';
import { InternalServeExceptionFilter } from 'src/shared/filter/internal-serve-exception/internal-serve-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'log', 'warn', 'debug'],
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new InternalServeExceptionFilter());

  app.enableCors({
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  });

  app.use(cookieParser());
  // Увеличиваем лимит размера тела запроса
  app.use(bodyParser.json({ limit: '200mb' }));
  app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

  app.setViewEngine('ejs');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useStaticAssets(join(__dirname, '..', '/public'));

  const { port } = app.get(ConfigService).getOrThrow('app');
  await app.listen(port);
  console.log('listen', port);
}
bootstrap();
