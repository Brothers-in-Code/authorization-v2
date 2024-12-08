import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getInfo(): any {
    const { currentEnv, host, port } = this.configService.get('app');

    return {
      currentEnv,
      host,
      port,
      cron: this.configService.get('cron'),
      server: this.configService.get('server'),
    };
  }
}
