import { Test, TestingModule } from '@nestjs/testing';
import { UserWorkGroupController } from '../user-work-group.controller';
import { UserGroupService } from 'src/db/services/user-group.service';
import { UserService } from 'src/db/services/user.service';
import { VkDataService } from 'src/vk-data/services/vkdata.service';
import { GroupService } from 'src/db/services/group.service';
import { HttpModule } from '@nestjs/axios';
import { DBModule } from 'src/db/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('GroupController', () => {
  let controller: UserWorkGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DBModule,
        HttpModule,
        TypeOrmModule.forRoot({
          type: 'mysql', // Или другой используемый вами тип базы данных
          database: ':memory:', // Для использования in-memory базы данных в тестах
          entities: [
            /* Вставьте ваши сущности сюда */
          ],
          synchronize: true,
        }),
      ],
      controllers: [
        UserWorkGroupController,
        UserGroupService,
        UserService,
        VkDataService,
        GroupService,
        HttpModule,
      ],
    }).compile();

    controller = module.get<UserWorkGroupController>(UserWorkGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
