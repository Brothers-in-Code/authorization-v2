import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from '../group.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { Group } from '../../entities/group.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('GroupService', () => {
  let service: GroupService;
  let groupRepository: Repository<Group>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: getRepositoryToken(Group), // Создаем токен для мока репозитория
          useClass: Repository, // Используем стандартный класс репозитория для мока
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
    groupRepository = module.get<Repository<Group>>(getRepositoryToken(Group));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
