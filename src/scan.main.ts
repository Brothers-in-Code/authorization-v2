import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ScanService } from 'src/modules/scan/scan-service.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3300;
  await app.listen(port);
  console.log('listen', port);

  const job = app.get(ScanService);
  await job.run();
  await app.close();
  console.log('scan service stop');
}
bootstrap();
