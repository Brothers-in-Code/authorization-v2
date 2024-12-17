import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Logger } from '@nestjs/common';

import { ScanService } from '../scan-service.service';
import { GroupService } from 'src/db/services/group.service';
import { SuccessResponseType } from 'src/types/api-response-type';

describe('ScanService', () => {
  let scanService: ScanService;
  let configService: ConfigService;
  let httpService: HttpService;
  let cronJobMock: jest.Mock<CronJob>;

  const dataSourceMock: Partial<DataSource> = {
    query: jest.fn(),
    initialize: jest.fn().mockResolvedValue(true),
    isInitialized: true,
  };

  beforeEach(async () => {
    cronJobMock = jest.fn(function () {
      return {
        start: jest.fn(),
        stop: jest.fn(),
      };
    }) as unknown as jest.Mock<CronJob>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScanService,
        Logger,
        ConfigService,
        { provide: DataSource, useValue: dataSourceMock },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'app.host') return 'test.ru';
              if (key === 'app.protocol') return 'https';
            }),
            getOrThrow: jest.fn(),
          },
        },
        { provide: GroupService, useValue: {} },
        {
          provide: SchedulerRegistry,
          useValue: {
            addCronJob: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              post: jest.fn(),
              get: jest.fn(),
            },
          },
        },
        {
          provide: CronJob,
          useValue: cronJobMock,
        },
      ],
    }).compile();

    scanService = module.get<ScanService>(ScanService);
    configService = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(scanService).toBeDefined();
  });

  // describe('onModuleInit', () => {
  //   let configServiceGetOrThrow: jest.SpyInstance;
  //   beforeEach(async () => {
  //     configServiceGetOrThrow = jest.spyOn(configService, 'getOrThrow');
  //   });
  //
  //   it('should start', async () => {
  //     configServiceGetOrThrow.mockReturnValue({
  //       enabled: 'true',
  //       schedule: '0 12 * * *',
  //     });
  //     scanService.onModuleInit();
  //     expect(configServiceGetOrThrow).toHaveBeenCalled();
  //     expect(cronJobMock().start).toHaveBeenCalled();
  //   });
  // });

  describe('getNewAccessToken', () => {
    let httpServicePost: jest.SpyInstance;

    beforeEach(() => {
      httpServicePost = jest.spyOn(httpService.axiosRef, 'post');
    });

    describe('successfully', () => {
      const mockUserId = 111;
      const successResponse: SuccessResponseType<any> = {
        success: {
          status: 200,
          message: 'Successfully created',
          code: 'success',
        },
        data: {
          access_token: 'mockAccessToken',
        },
      };

      it('should return data', async () => {
        httpServicePost.mockResolvedValue({ data: successResponse });
        const response = await scanService.getNewAccessToken(mockUserId);
        expect(response).toEqual(successResponse);
      });
    });
  });

  describe('getDataForScanning', () => {
    const mockJSON = `{
  "access_token": "mockAccess_token",
  "device_id": "mockDevice_id",
  "groupVkIdList": [
    1,
    2,
    3,
    4
  ],
  "refresh_token": "mockRefresh_token",
  "userVkId": 101
}`;
    const mockResponseData = {
      data: mockJSON,
    };

    let httpServiceGet: jest.SpyInstance;
    beforeEach(() => {
      httpServiceGet = jest.spyOn(httpService.axiosRef, 'get');
    });

    describe('successfuly', () => {
      it('should get data', async () => {
        httpServiceGet.mockResolvedValue({
          data: mockResponseData,
        });
        const response = await scanService.getDataForScanning();
        expect(response).toEqual(JSON.parse(mockJSON));
      });
    });
  });
});
