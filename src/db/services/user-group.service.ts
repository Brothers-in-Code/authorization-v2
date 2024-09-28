import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGroup } from '../entities/user_group.entity';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Group } from '../entities/group.entity';
import { group } from 'console';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
  ) {}

  async create(user: User, group: Group): Promise<UserGroup> {
    const userGroup = new UserGroup();
    userGroup.user = user;
    userGroup.group = group;
    return await this.userGroupRepository.save(userGroup);
  }

  async findAll(): Promise<UserGroup[]> {
    return await this.userGroupRepository.find();
  }

  async findUsersGroupList(
    user_vkid: number,
  ): Promise<{ user_vkid: number; groups: Group[] }> {
    const userGroups = await this.userGroupRepository
      .find({
        where: { user: { user_vkid: user_vkid } },
        relations: ['group'],
      })
      .then((data) =>
        data.map((group) => {
          const localGroup = group.group;
          delete localGroup.created_at;
          delete localGroup.deleted_at;
          delete localGroup.updated_at;
          return localGroup;
        }),
      );

    return {
      user_vkid,
      groups: userGroups,
    };
  }
}
