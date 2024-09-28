import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGroup } from '../entities/user_group.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
  ) {}

  async findAll(): Promise<UserGroup[]> {
    return await this.userGroupRepository.find();
  }

  async findUsersGroupList(user_id: number): Promise<UserGroup[]> {
    return await this.userGroupRepository.find({
      where: { user_id: user_id },
    });
  }

  async findUserGroup(user_id: number, group_id: number): Promise<UserGroup> {
    const result = await this.userGroupRepository.findOneBy({
      user_id: user_id,
      group_id: group_id,
    });
    if (!result) {
      throw new NotFoundException(
        `User with user_id = ${user_id} or group group_id = ${group_id} not found`,
      );
    }
    return result;
  }

  async deleteUserGroup(
    user_id: number,
    group_id: number,
  ): Promise<DeleteResult> {
    const result = await this.userGroupRepository.delete({
      user_id: user_id,
      group_id: group_id,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `User with user_id = ${user_id} or group group_id = ${group_id} not found`,
      );
    }
    return result;
  }
}
