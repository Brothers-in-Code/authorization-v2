import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_USER
      : process.env.INTEGRATION_DB_USER,
  password:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_PASSWORD
      : process.env.INTEGRATION_DB_PASSWORD,
  database:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_NAME
      : process.env.INTEGRATION_DB_NAME,
  entities: ['src/db/entities/*.entity{.ts,.js}'],
  migrations: ['src/db/migrations/*.js'],
  migrationsTableName: 'typeorm_migrations',
});
