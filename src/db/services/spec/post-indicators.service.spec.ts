import { Test, TestingModule } from '@nestjs/testing';
import {
  PostIndicatorParamsType,
  PostIndicatorsService,
} from 'src/db/services/post-indicators.service';
import { DataSource, Repository } from 'typeorm';
import { PostIndicators } from 'src/db/entities/postIndicators.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from 'src/configuration';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DBModule } from 'src/db/db.module';
import { Post } from 'src/db/entities/post.entity';

describe('PostIndicatorsService', () => {
  let service: PostIndicatorsService;
  let repository: Repository<PostIndicators>;
  let dataSource: DataSource;
  let queryRunner: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DBModule,
        await ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
          load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              type: 'mariadb',
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
              migrationsTransactionMode: 'all',
              multipleStatements: true,
              logging: false,
            };
          },
        }),
        TypeOrmModule.forFeature([PostIndicators]),
      ],
      providers: [PostIndicatorsService],
    }).compile();

    service = module.get<PostIndicatorsService>(PostIndicatorsService);
    repository = module.get<Repository<PostIndicators>>(
      getRepositoryToken(PostIndicators),
    );
    dataSource = module.get<DataSource>(DataSource);
    queryRunner = dataSource.createQueryRunner();

    await queryRunner.startTransaction();
  });

  afterAll(async () => {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create new record postIndicator to DB', async () => {
    const datetime = Date.now();
    const mockPostIndicatorsProp: PostIndicatorParamsType = {
      post: { id: 1 } as Post,
      indicators: {
        datetime: datetime,
        views: 1,
        likes: 1,
        repost: 1,
        comment: 1,
      },
    };

    const newPostIndicatorList = await service.createOrUpdatePostIndicatorList([
      mockPostIndicatorsProp,
    ]);

    expect(newPostIndicatorList).toBeDefined();
  });
});
