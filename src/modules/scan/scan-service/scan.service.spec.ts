import { Test, TestingModule } from '@nestjs/testing';
import { ScanService } from '../scan-service/scan-service.service';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { VkDataService } from 'src/modules/vk-data/services/vkdata.service';
import { GroupService } from 'src/db/services/group.service';
import { Logger } from '@nestjs/common';

describe('ScanService', () => {
  let service: ScanService;
  let dataSourceMock: Partial<DataSource>;

  beforeEach(async () => {
    // Мок для DataSource с необходимыми методами
    dataSourceMock = {
      query: jest.fn(),
      initialize: jest.fn().mockResolvedValue(true),
      isInitialized: true,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScanService,
        { provide: DataSource, useValue: dataSourceMock }, // Подменяем DataSource моком
        { provide: ConfigService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: VkDataService, useValue: {} },
        { provide: GroupService, useValue: {} },
        Logger,
      ],
    }).compile();

    service = module.get<ScanService>(ScanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
