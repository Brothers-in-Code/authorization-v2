import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from './configuration';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DBModule } from 'src/db/db.module';
import { VkDataModule } from './modules/vk-data/vkdata.module';
import { FrontModule } from './modules/front/front.module';
import { ScanService } from './modules/scan/scan-service/scan-service.service';
import { ScanModule } from 'src/modules/scan/scan.module';
import { WorkSpaceModule } from './modules-render/work-space/work-space.module';
import { HomeModule } from './modules-render/home/home.module';

@Module({
  imports: [
    AuthModule,
    DBModule,
    VkDataModule,
    FrontModule,
    ScanModule,
    WorkSpaceModule,
    HomeModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('db.host'),
          port: Number(configService.get('db.port')),
          username: configService.get('db.username'),
          password: configService.get('db.password'),
          database: configService.get('db.database'),
          namingStrategy: new SnakeNamingStrategy(),
          migrations: ['./dist/migrations/*.js'],
          migrationsTableName: 'typeorm_migrations',
          synchronize: false,
          migrationsRun: true,
          autoLoadEntities: true,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ScanService],
})
export class AppModule {}
