import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from '../entities/group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  findAll(): Promise<Group[]> {
    return this.groupRepository.find();
  }

  findOne(group_vkid: number): Promise<Group> {
    return this.groupRepository.findOneBy({ group_vkid });
  }

  createGroup(groupParams: Partial<Group>): Promise<Group> {
    return this.groupRepository.save(groupParams);
  }

  async updateGroupScanDate(
    group_vkid: number,
    last_group_scan_date: Date,
  ): Promise<{ result: Date; message: string }> {
    const group_id = await this.groupRepository.findOneBy({
      group_vkid,
    });

    if (!group_id) {
      throw new NotFoundException(`Group id: ${group_vkid} not found`);
    }

    return this.groupRepository
      .update(group_id.id, {
        last_group_scan_date,
      })
      .then(() => ({
        result: last_group_scan_date,
        message: 'Group scan date updated successfully',
      }))
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });
  }
}
