import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from '../entities/group.entity';
import { Repository } from 'typeorm';

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

  create(groupParams: CreateGroupParamsType): Promise<Group> {
    const newGroup = new Group();
    Object.assign(newGroup, groupParams);
    return this.groupRepository.save(newGroup);
  }

  async updateGroupScanDate(
    vkid: number,
    last_group_scan_date: Date,
  ): Promise<{ result: Date; message: string }> {
    const group_id = await this.groupRepository.findOneBy({
      vkid,
    });

    if (!group_id) {
      throw new NotFoundException(`Group id: ${vkid} not found`);
    }

    return (
      this.groupRepository
        .update(group_id.id, {
          last_group_scan_date,
        })
        //    TODO сделать проверку на affectedRows
        .then(() => ({
          result: last_group_scan_date,
          message: 'Group scan date updated successfully',
        }))
        .catch((error) => {
          throw new InternalServerErrorException(error);
        })
    );
  }
}
