import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { UserService } from 'src/db/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/entities/user.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { configuration } from 'src/configuration';

describe('AuthService Intergration Test', () => {
  let service: AuthService;
  let userService: UserService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              integrationDb: {
                host: 'localhost',
                port: 3306,
                username: 'admin',
                password: 'dbpassword',
                database: 'smm_test',
              },
            }),
          ],
        }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              type: 'mariadb',
              host: configService.get('integrationDb.host'),
              port: Number(configService.get('integrationDb.port')),
              username: configService.get('integrationDb.username'),
              password: configService.get('integrationDb.password'),
              database: configService.get('integrationDb.database'),
              entities: [User],
            };
          },
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [
        AuthService,
        UserService,
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('AuthService Unit Test', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return expires date', async () => {
    const expire_in = 3600;
    const RESPONSE_DELAY = 200;
    const date = new Date();
    date.setSeconds(date.getSeconds() + expire_in - RESPONSE_DELAY);
    const result = service.calcExpiresDate(expire_in);
    const dateResult = new Date(result).getTime();
    expect(dateResult).toBeLessThanOrEqual(date.getTime());
  });
});

// "paths": {
//   "./src/*": [
//     "./src/*"
//   ]
// },
