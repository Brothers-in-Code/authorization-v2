import { ConfigService } from '@nestjs/config';

const db = new ConfigService().get('db');

export const ormconfig = {
  type: 'mysql',
  host: db.host,
  port: db.port,
  username: db.username,
  password: db.password,
  database: db.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Автоматическая синхронизация схемы
};
