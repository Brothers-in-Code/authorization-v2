import { Test, TestingModule } from '@nestjs/testing';
import { UserWorkGroupController } from '../user-work-group.controller';
import { UserGroupService } from 'src/db/services/user-group.service';
import { UserService } from 'src/db/services/user.service';
import { VkDataService } from 'src/modules/vk-data/services/vkdata.service';
import { GroupService } from 'src/db/services/group.service';
import { HttpModule } from '@nestjs/axios';
import { DBModule } from 'src/db/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('UserWorkGroupController', () => {
  let controller: UserWorkGroupController;
  let userGroupServiceMock: Partial<UserGroupService>;
  let userServiceMock: Partial<UserService>;
  let vkDataServiceMock: Partial<VkDataService>;
  let groupServiceMock: Partial<GroupService>;

  beforeEach(async () => {
    // Моки для всех зависимостей
    userGroupServiceMock = {
      getUsersGroupList: jest.fn().mockResolvedValue([]),
    };
    userServiceMock = {
      findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Test User' }),
    };
    vkDataServiceMock = {
      getWallByDomain: jest.fn().mockResolvedValue({}),
    };
    groupServiceMock = {
      findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Test Group' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DBModule,
        HttpModule,
        TypeOrmModule.forRoot({
          type: 'mysql', // Ваш тип базы данных
          database: ':memory:', // In-memory база данных для тестов
          entities: [
            /* Добавьте сущности сюда, если они нужны для тестов */
          ],
          synchronize: true,
        }),
      ],
      controllers: [UserWorkGroupController],
      providers: [
        { provide: UserGroupService, useValue: userGroupServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: VkDataService, useValue: vkDataServiceMock },
        { provide: GroupService, useValue: groupServiceMock },
      ],
    }).compile();

    controller = module.get<UserWorkGroupController>(UserWorkGroupController);
  }, 10000);

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
