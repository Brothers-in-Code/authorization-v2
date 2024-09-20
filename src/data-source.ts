import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get('db.host'),
  port: Number(configService.get('db.port')),
  username: configService.get('db.username'),
  password: configService.get('db.password'),
  database: configService.get('db.database'),
  entities: ['src/db/**/*.entity{.ts,.js}'],
  migrations: ['./dist/db/migrations/*.js'],
  migrationsTableName: 'typeorm_migrations',
});
