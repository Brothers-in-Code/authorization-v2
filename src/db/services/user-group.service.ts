import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGroup } from 'src/db/entities/user_group.entity';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Group } from '../entities/group.entity';

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

  async createUserGroupList(
    user: User,
    groupList: Group[],
  ): Promise<UserGroup[]> {
    const existingVkIdList = await this.findUsersGroupList(user.user_vkid);
    const newGroupList = groupList.filter((group) => {
      return !existingVkIdList.groups.some(
        (existingGroup) => existingGroup.vkid === group.vkid,
      );
    });
    if (newGroupList.length > 0) {
      return this.userGroupRepository.save(newGroupList);
    }
    return [];
  }

  async findAll(): Promise<UserGroup[]> {
    return await this.userGroupRepository.find();
  }

  async findUsersGroupList(
    user_vkid: number,
  ): Promise<{ user_vkid: number; groups: Group[] }> {
    const userGroups = await this.userGroupRepository
      .find({
        where: { user: { user_vkid } },
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

  async remove(user_vkid: number, group_vkid: number): Promise<DeleteResult> {
    return await this.userGroupRepository.delete({
      user: { user_vkid },
      group: { vkid: group_vkid },
    });
  }

  async add(user: User, group: Group): Promise<UserGroup> {
    const userGroup = new UserGroup();
    userGroup.user = user;
    userGroup.group = group;
    return await this.userGroupRepository.save(userGroup);
  }
}
