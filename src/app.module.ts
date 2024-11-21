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
import { JwtModule } from '@nestjs/jwt';
import { LoginModule } from './modules/login/login.module';

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
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('APP_JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
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
          migrations: ['./src/db/migrations/*.js'],
          migrationsTableName: 'typeorm_migrations',
          synchronize: false,
          migrationsRun: true,
          autoLoadEntities: true,
          logging: false,
        };
      },
    }),
    LoginModule,
  ],
  controllers: [AppController],
  providers: [AppService, ScanService],
})
export class AppModule {}
