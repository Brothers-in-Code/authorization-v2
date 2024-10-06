import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from '../entities/group.entity';
import { In, Repository } from 'typeorm';
import { DatabaseServiceError } from 'src/errors/service-errors';

type CreateGroupParamsType = {
  vkid: number;
  name: string;
  is_private: boolean;
  photo?: string;
};

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  findAll(): Promise<Group[]> {
    return this.groupRepository.find();
  }

  findOne(vkid: number): Promise<Group> {
    return this.groupRepository.findOneBy({ vkid });
  }

  async create(groupParams: CreateGroupParamsType): Promise<Group> {
    let group = await this.groupRepository.findOneBy({
      vkid: groupParams.vkid,
    });
    if (!group) {
      group = new Group();
    }
    Object.assign(group, groupParams);
    return this.groupRepository.save(group);
  }

  createNewGroup() {
    return new Group();
  }

  async createGroupList(groupList: Group[]): Promise<Group[]> {
    const vkidList = groupList.map((group) => group.id);
    const existingVkIdList = await this.groupRepository
      .find({
        where: { vkid: In(vkidList) },
      })
      .then((groupList) => groupList.map((group) => group.vkid));

    const newGroupList = groupList.filter(
      (group) => !existingVkIdList.includes(group.vkid),
    );
    if (newGroupList.length > 0) {
      return this.groupRepository.save(newGroupList);
    }
    return [];
  }

  async updateGroupScanDate(
    vkid: number,
    last_group_scan_date: Date,
  ): Promise<{ result: Date; message: string }> {
    const group_id = await this.groupRepository.findOneBy({
      vkid,
    });

    if (!group_id) {
      throw new NotFoundException(
        `func: updateGroupScanDate. Group vkid: ${vkid} not found`,
      );
    }

    return this.groupRepository
      .update(group_id.id, {
        last_group_scan_date,
      })
      .then((result) => {
        if (result.affected === 0) {
          throw new DatabaseServiceError(
            `Group vkid ${vkid} scan date not updated`,
          );
        }
        return {
          result: last_group_scan_date,
          message: 'Group scan date updated successfully',
        };
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });
  }
}
