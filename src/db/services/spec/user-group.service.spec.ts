import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupService } from '../user-group.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserGroup } from '../../entities/user_group.entity';
import { Repository } from 'typeorm';

describe('UserGroupService', () => {
  let service: UserGroupService;
  let repository: Repository<UserGroup>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserGroupService,
        {
          provide: getRepositoryToken(UserGroup),
          useClass: Repository, // Используем мок-репозиторий
        },
      ],
    }).compile();

    service = module.get<UserGroupService>(UserGroupService);
    repository = module.get<Repository<UserGroup>>(
      getRepositoryToken(UserGroup),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
