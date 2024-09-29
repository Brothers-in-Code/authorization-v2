import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ScanServiceService } from 'src/scan/scan-service/scan-service.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const job = app.get(ScanServiceService);
  await job.run();
  await app.close();
  console.log('DONE');
}
bootstrap();
