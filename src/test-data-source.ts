import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'mysql',
  host: process.env.INTEGRATION_DB_HOST,
  port: Number(process.env.INTEGRATION_DB_PORT),
  username: process.env.INTEGRATION_DB_USER,
  password: process.env.INTEGRATION_DB_PASSWORD,
  database: process.env.INTEGRATION_DB_NAME,
  entities: ['src/db/entities/*.entity{.ts,.js}'],
  migrations: ['src/db/migrations/*.js'],
  migrationsTableName: 'typeorm_migrations',
});
