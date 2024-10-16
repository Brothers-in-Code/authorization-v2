import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGroup } from 'src/db/entities/user_group.entity';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Group } from '../entities/group.entity';
import { GroupService } from './group.service';
import { group } from 'console';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
    private readonly groupService: GroupService,
  ) {}

  private readonly logger = new Logger(UserGroupService.name);

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
    const existingUserGroupList = await this.userGroupRepository.find({
      where: { user: { user_vkid: user.user_vkid } },
      relations: ['group'],
    });

    const newGroupList = groupList.filter((group) => {
      return !existingUserGroupList.some(
        (existingGroup) => existingGroup.group.vkid === group.vkid,
      );
    });

    const newUserGroupList = newGroupList.map((group) => {
      const userGroup = new UserGroup();
      userGroup.user = user;
      userGroup.group = group;
      return userGroup;
    });
    if (newGroupList.length > 0) {
      const result = await this.userGroupRepository.save(newUserGroupList);
      return result;
    }
    return [];
  }

  async findAll(): Promise<UserGroup[]> {
    return await this.userGroupRepository.find();
  }

  async getUsersGroupList({
    user_vkid,
    offset,
    limit,
    is_scan,
  }: {
    user_vkid: number;
    offset: number;
    limit: number;
    is_scan?: number;
  }): Promise<{
    total: number;
    offset: number;
    limit: number;
    user_vkid: number;
    groups: { group: Group; isScan: number }[];
  }> {
    const whereConditions: any = {
      user: { user_vkid },
    };

    if (is_scan !== undefined) {
      whereConditions['is_scan'] = is_scan;
    }
    const total = await this.userGroupRepository.count({
      where: whereConditions,
    });

    const groups = await this.userGroupRepository
      .find({
        where: whereConditions,
        relations: ['group'],
        skip: offset,
        take: limit,
      })
      .then((data) =>
        data.map((group) => {
          const localGroup = group.group;
          delete localGroup.created_at;
          delete localGroup.deleted_at;
          delete localGroup.updated_at;
          return {
            group: localGroup,
            isScan: group.is_scan,
          };
        }),
      );
    return {
      total,
      offset,
      limit,
      user_vkid,
      groups,
    };
  }

  async findAllByUser(user_id: number): Promise<Group[]> {
    const groups = await this.userGroupRepository
      .find({
        where: { user: { id: user_id } },
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

    return groups;
  }

  //   TODO логер и ответ
  async updateIsScanStatus(
    userId: number,
    dataList: { groupVkId: string; isScan: boolean }[],
  ) {
    for (const data of dataList) {
      const group = await this.groupService.findOne(Number(data.groupVkId));
      await this.userGroupRepository.update(
        {
          user: { id: userId },
          group: { id: group.id },
        },
        {
          is_scan: data.isScan ? 1 : 0,
        },
      );
    }
    return true;
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
